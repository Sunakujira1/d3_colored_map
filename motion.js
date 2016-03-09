const TOTAL_TIME = 10 * 1000; // In milliseconds
const TICK = 50;

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.renderMap = this.renderMap.bind(this);

    this.state = { time: 0, selected: {} };
  }

  componentDidMount() {
    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight;

    const svg = d3.select('svg');
    svg.attr('width', innerWidth)
      .attr('height', innerHeight);

    const group = svg.append('g').attr('transform', 'translate(0, 0)');

    const xScale = d3.scale.linear().range([50, innerWidth - 50]);
    const yScale = d3.scale.linear().range([innerHeight - 50, 50]);
    const rScale = d3.scale.sqrt().range([0, 20]);
    const cScale = d3.scale.category20();

    const type = d => {
      return {
        name: d.asciiname,
        latitude: +d.latitude,
        longitude: +d.longitude,
        population: +d.population,
        country: d.country_code,
        timezone: d.timezone,
      };
    };

    const store = data => {
      xScale.domain(d3.extent(data, d => d.longitude));
      yScale.domain(d3.extent(data, d => d.latitude));
      rScale.domain([0, d3.max(data, d => d.population)]);
      const tScale = d3.scale.pow().exponent(0.2)
        .range([d3.max(data, d => d.population), 100000])
        .domain([0, TOTAL_TIME]);

      this.setState({ group, xScale, yScale, rScale, cScale, tScale, data });

      const tick = () => {
        const { time, interval } = this.state;
        if (time <= TOTAL_TIME) {
          this.setState({ time: time + TICK });
        } else {
          clearInterval(interval);
        }
        this.renderMap();
      };
      this.setState({ interval: setInterval(tick, TICK) });
    };

    d3.csv('./cities15000_min.csv', type, store);
  }

  renderMap() {
    const { group, xScale, yScale, rScale, cScale, tScale, data, time } = this.state;
    const circles = group.selectAll('circle')
      .data(data.filter(city => city.population > tScale(time)));
    circles.enter().append('circle');

    circles
      .attr('cx', d => xScale(d.longitude))
      .attr('cy', d => yScale(d.latitude))
      .attr('r', d => rScale(d.population))
      .attr('fill', d => cScale(d.timezone))
      .attr('fill-opacity', '0.3')
      .on('mouseover', d => {
        this.setState({ selected: Object.assign({}, d) });
      })
      .on('mouseleave', () => {
        this.setState({ selected: {} });
      });
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
