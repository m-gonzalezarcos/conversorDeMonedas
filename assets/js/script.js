const options = {
    series: [{
      name: 'CLP',
      data: []
  }],
    chart: {
    height: 350,
    type: 'line',
    zoom: {
      enabled: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'straight'
  },
  title: {
    text: 'Últimos diez días',
    align: 'left'
  },
  grid: {
    row: {
      colors: ['#f3f3f3', 'transparent',], // takes an array which will be repeated on columns
      opacity: 0.5
    },
  },
  xaxis: {
    categories: []
  }
  };

//generar data creando función renderChart
 const renderChart = (serie)=>{

    //método slice devuelve una parte del array indicado el index donde comienza y el index donde termina y funciona para string.
    const ultimosDiezDias = serie.slice(0, 10)

    //método reverse invierte el orden de los elementos en un arrayen este caso invierte el orden de las fechas a mostrar en el gráfico
    ultimosDiezDias.reverse();

    //limpiar la data antes de agregar data nueva
    options.series[0].data = [];
    options.xaxis.categories = [];

    //recorrer los últimos días con foreach
    ultimosDiezDias.forEach((dia) => {
        options.series[0].data.push(dia.valor)
        
        //método split divide un objeto de tipo string en el array
        options.xaxis.categories.push(dia.fecha.split('T')[0]);
    });

    const chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
 };

//crear función getData con parámetro indicador ycada vez que ejecuto la función paso el parámetro para asi armar la ruta con interpolación
const getData = async(indicador) =>{
    try{
    //método fetch funciona en dos pasos. 1° la respuesta con el endpoint
        const response = await fetch(`https://mindicador.cl/api/${indicador}`);

    //2° fetch se convierte en json
        const json = await response.json();
        return json
    }catch(e){
        console.log(e);
    }
};

//seleccionar botón con el evento click
const boton = document.getElementById('btn');
boton.addEventListener('click', async() =>{

//capturar los input
const valores = document.getElementById('ingresarValores').value;
const dinero = document.getElementById('moneda').value;

//ejecutar función getData
const data = await getData(dinero);
console.log(data);
let conversion = valores / data.serie[0].valor

const result = document.getElementById('resultado');
//método Tofixed formatea un número y el número se redondea si es necesario
result.innerHTML = `Resultado: $${conversion.toFixed(2)}`;

//ejecutar función renderChart
renderChart(data.serie);
});