class Test extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const innerWidth = window.innerWidth * 0.98;
    const innerHeight = window.innerHeight * 0.97;

    const svg = d3.select('svg');
    svg.attr('width', innerWidth)
      .attr('height', innerHeight);

    let xScale = d3.scale.linear().range([0, innerWidth]);
    let yScale = d3.scale.linear().range([innerHeight, 0]);
    let rScale = d3.scale.sqrt().range([0,5]);
    let cScale = d3.scale.category20();

    const render = data => {
      xScale.domain(d3.extent(data, d => d.longitude));
      yScale.domain(d3.extent(data, d => d.latitude));
      rScale.domain([0, d3.max(data, d => d.population)]);
      let circles = svg.selectAll('circle').data(data);
      circles.enter().append('circle');

      circles
        .attr('cx', d => xScale(d.longitude))
        .attr('cy', d => yScale(d.latitude))
        .attr('r', d => rScale(d.population))
        .attr('stroke', d => cScale(d.country))
        .attr('stroke-width', '1');
        // .attr('fill', 'rgba(255,255,102,0.5)');
    }

    const type = d => {
      return {
        latitude: +d.latitude,
        longitude: +d.longitude,
        population: +d.population,
        country: d.country_code,
      }
    }

    d3.csv('./cities1000_min.csv', type, render);

  }

  render() {
    return (
      <svg style={{ backgroundColor: 'black' }} />
    );
  }
}


ReactDOM.render(
  <Test />,
  document.getElementById('root')
);
