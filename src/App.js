import React from 'react';
import { ReactiveBase, DataSearch, ResultCard, ReactiveList } from '@appbaseio/reactivesearch';
import './App.css';
class Main extends React.Component {
  render() {
    return (
      <div className="main-container">
        <ReactiveBase
          app="swat"
          type="incident"
          url="http://localhost:9200/"
        >
        <div className="navbar"> 
          <div className="logo">
            Oscar - Know your incident
          </div>
          <DataSearch
            componentId="mainSearch"
            dataField={["incident_id", "description"]}
            defaultSelected="WEPWPP3900WQ"
            queryFormat="or"
            highlight="true"
            highlightField="incident_id"
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
            <ResultCard/>
            </div>  
          </div>
          
          <div className={"mainBar"}>
            <ReactiveList
              componentId="results"
              dataField={['description','incident_id','task_id']}
              size={3}
              pagination={true}
              react={{
                  and: ['mainSearch'],
              }}
              render={({ data }) => (
                  <ReactiveList.ResultCardsWrapper>
                      {data.map(item => (
                          <ResultCard key={item._id}>
                              <ResultCard.Image
                                  src=""
                              />
                              <ResultCard.Title
                                  dangerouslySetInnerHTML={{
                                      __html: item.incident_id == null ? item.task_id: item.incident_id,
                                  }}
                              />
                              <ResultCard.Description>
                                  {item.description + ' ' + '*'.repeat(item.incident_id)}
                              </ResultCard.Description>
                          </ResultCard>
                      ))}
                  </ReactiveList.ResultCardsWrapper>
              )}
            />
          </div>
          
        </ReactiveBase>
      </div>
    );
  }
}
export default Main;