class Test extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight;

    const svg = d3.select('svg');
    svg.attr('width', innerWidth)
      .attr('height', innerHeight);

    const g = svg.append('g').attr('transform', 'translate(0, 0)');

    const xScale = d3.scale.linear().range([50, innerWidth-50]);
    const yScale = d3.scale.linear().range([innerHeight-50, 50]);
    const rScale = d3.scale.sqrt().range([0.1, 10]);
    const cScale = d3.scale.category20();

    const render = data => {
      xScale.domain(d3.extent(data, d => d.longitude));
      yScale.domain(d3.extent(data, d => d.latitude));
      rScale.domain([0, d3.max(data, d => d.population)]);
      const circles = g.selectAll('circle').data(data);
      circles.enter().append('circle');

      circles
        .attr('cx', d => xScale(d.longitude))
        .attr('cy', d => yScale(d.latitude))
        .attr('r', d => rScale(d.population))
        .attr('stroke', d => cScale(d.timezone))
        .attr('stroke-width', '1');
        // .attr('fill', 'rgba(255,255,102,0.5)');
    };

    const type = d => {
      return {
        latitude: +d.latitude,
        longitude: +d.longitude,
        population: +d.population,
        country: d.country_code,
        timezone: d.timezone,
      };
    };

    d3.csv('./CAwithZero_min.csv', type, render);
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
