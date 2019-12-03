import React from 'react';
import { XYPlot, LineSeries, RadialChart } from 'react-vis';

class Doghnut extends React.Component {
    render() {
      const results = this.props.results;
      var regionData = {};
      var teamData = {}
      results.map((item) => {
        if(!!item.Region) {
          if(!Object.keys(regionData).includes(item.Region)) {
            regionData[item.Region] = 1;
          }
          else {
            regionData[item.Region]++;
          }
        }
        else if(!!item.Team) {
          if(!Object.keys(teamData).includes(item.Team)) {
            teamData[item.Team] = 1;
          }
          else {
            teamData[item.Team]++;
          }
        }
      });
      const radius = {
        innerRadius: 5, 
        radius : 10,
        labelsStyle : {
          color: "red",
          fontSize: 8,
          fontFamily: "Lato Bold, Lato",
          letterSpacing: 0.4
        }
      };
      var regionChartData = [];
      var teamChartData = [];
      Object.keys(regionData).map(region => {
        regionChartData.push({...radius, angle:regionData[region], label: region});
      });
      Object.keys(teamData).map(team => {
        teamChartData.push({...radius, angle:teamData[team], label: team});
      });
      return (
        <div>
          {regionChartData.length>0 && 
          <div>
          <h4 className="chartTitle">Regions Impacted</h4>  
            <RadialChart
              data={regionChartData}
              width={200}
              height={200}
              showLabels={true} /> 
          </div>
          }
          {teamChartData.length>0 &&
          <div>
          <h4 className="chartTitle">Teams Involved</h4>
            <RadialChart
              data={teamChartData}
              width={200}
              height={200} 
              showLabels={true} />         
          </div>
          }
        </div>        
      );
    }
  }
  
  export default Doghnut;