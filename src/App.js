import React from 'react';
import { ReactiveBase, DataSearch, ResultCard } from '@appbaseio/reactivesearch';
import './App.css';
class Main extends React.Component {
  render() {
    return (
      <div className="main-container">
        <ReactiveBase
          app="KnowYourIncident"
          credentials="RxIAbH9Jc:6d3a5016-5e9d-448f-bd2b-63c80b401484"
         >
          <div className="navbar"> 
          <div className="logo">
            Oscar - Know your incident
          </div>
          <DataSearch
            componentId="mainSearch"
            dataField={["incident_id", "description"]}
            queryFormat="and"
            placeholder="Search by Incident ID or Keyword..."
            className="datasearch"
            innerClass={{
              "input": "searchbox",
              "list": "suggestionlist"
            }}
          />
          </div>
        <div className={"display"}>
          <div className={"leftSidebar"}>
            <ResultCard
              componentId="resultsKnowledgeBase"
              dataField="KnowledgeBase"
              react={{
                and: ["mainSearch"]
              }}
              onData={(res) => (
                {
                  "id": res.confluence_id,
                  "description": res.description,
                  "team": res.team_name
                }
              )}
            />
            </div>  
          </div>
          
          <div className={"mainBar"}>
            <ResultCard
              componentId="resultsIncident"
              dataField="Incident"
              react={{
                and: ["mainSearch"]
              }}
              onData={(res) => (
                {
                  "id": res.incident_id,
                  "description": res.description
                }
              )}
              
              className="result-data"
              innerClass={{
                "image": "result-image",
                "resultStats": "result-stats"
              }}
            />
          </div>
          
        </ReactiveBase>
      </div>
    );
  }
}
export default Main;