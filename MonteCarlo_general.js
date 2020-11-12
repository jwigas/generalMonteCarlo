function draw() {
try {
      // compile the expression once
      expression = document.getElementById('eq').value
      expr = math.compile(expression)

      // evaluate the expression repeatedly for different values of x
      xValues = math.range(+document.getElementById('bdyX1').value, +document.getElementById('bdyX2').value +0.1,0.1).toArray()
      yValues = xValues.map(function (x) {
        return expr.evaluate({x: x})
      })

      // Monte Carlo Methods
      function MonteCarloMethods(expr,xMin,xMax,yMin,yMax,numOfSamples){
        var i;
        var samples=[];
        var outside=[];
        for (i=0; i<numOfSamples; i++){
          randomX = xMin + Math.random()*(xMax-xMin);
          randomY = yMin + Math.random()*(yMax-yMin);
          if(randomY<expr.evaluate({x: randomX})){
            samples.push([randomX,randomY])
            //console.log(samples) //uncomment to cek the output
          }
          else{
            outside.push([randomX,randomY])
          }
        }
        return [samples,outside];
      }

      function AreaOfMonteCarlo(xMin,xMax,yMin,yMax,ratio){
      Area = (xMax-xMin)*(yMax-yMin)*ratio
      return Area;
      }

      xMin = Math.min.apply(null,xValues)
      xMax = Math.max.apply(null,xValues)
      yMin = 0
      yMax = Math.max.apply(null,yValues)
      numOfSamples = document.getElementById('smpls').value

      result = MonteCarloMethods(expr,xMin,xMax,yMin,yMax,numOfSamples)
     
      //extract the generated data
      xUnderFunction = []
      yUnderFunction = []

      for (i=0;i<result[0].length;i++){
        xUnderFunction.push(result[0][i][0]);
        yUnderFunction.push(result[0][i][1]);
      };

      //extract the generated data
      xOutsideFunction = []
      yOutsideFunction = []
 
      for (i=0;i<result[1].length;i++){
        xOutsideFunction.push(result[1][i][0]);
        yOutsideFunction.push(result[1][i][1]);
      };


      console.log("counted: ",result[0].length," total samples: ",numOfSamples," Ratio: ",ratio = result[0].length/numOfSamples) 
      console.log("area : ", AreaOfMonteCarlo(xMin,xMax,yMin,yMax,ratio))

      //Printed in html
      document.getElementById("Values2")
        .innerHTML=  "counted: " + result[0].length + " total samples: " + numOfSamples + " Ratio: " + ratio.toFixed(3) + "</br>"
                    +"The total area of "+"$ f(x)="+ math.parse(expression).toTex({parenthesis: 'keep'}) + "$ "
                    + " from "+xMin.toFixed(0)+" to "+xMax.toFixed(0)+" is : <strong>" + AreaOfMonteCarlo(xMin,xMax,yMin,yMax,ratio).toFixed(3) + "</strong></br>"
                    ;
  

      // End of Monte Carlo Method
      // render the plot using plotly

      const trace1 = {
        x: xValues,
        y: yValues,
        type: 'lines',
        marker:{
          color: "red",
          width: 2,
        },
        name: 'Function Lines',
      }

      const resultUnderFunction ={
        x: xUnderFunction,
        y: yUnderFunction,
        type: 'scatter',
        mode: 'markers',
        marker:{
          color: "blue"
        },
        name: 'Under the Function'
      }

      const resultOutsideFunction ={
        x: xOutsideFunction,
        y: yOutsideFunction,
        type: 'scatter',
        mode: 'markers',
        marker:{
          color: "lightslategray"
        },
        name: 'Outside the Function'
      }

      const data = [trace1, resultUnderFunction,resultOutsideFunction]
      var layout = {
        showlegend: true,
        legend: {
          orientation: 'h'
        },
        margin:{l:50, r:10, t:20, b:10},
      };

      var config = {responsive: true}

        Plotly.newPlot('plot', data, layout, config)    
    } //End of try function
  catch (err) {
    console.error(err)
    alert(err)
  }
}

document.getElementById('form').onsubmit = function (event) {
  event.preventDefault()
  draw()
  var HUB = MathJax.Hub;
  HUB.Queue(["Typeset", HUB, "Values2"]);
}

draw()