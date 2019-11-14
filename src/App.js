import React from 'react';
import { ReactiveBase, DataSearch, ResultCard, ReactiveList, ResultList } from '@appbaseio/reactivesearch';
import './App.css';
import config from './config';
import { isNull } from 'util';

class Main extends React.Component {
  state = {
    loadResults : false
  }
  render() {
    return (
      <div className="main-container">
        <ReactiveBase
          app={config.elasticsearch_index}
          type={config.elasticsearch_type}
          url={config.elasticsearch_url}
        >
        <div className="navbar"> 
          <div className="logo">
            Oscar - Know your incident
          </div>
          <DataSearch
            componentId="mainSearch"
            dataField={["IncidentId", "Description", "Team", "Title", "RelatedIncidentId"]}
            queryFormat="or"
            placeholder="Search by Incident ID or Keyword..."
            className="datasearch"
            onValueChange = {(value) => { 
              if(value == '') this.setState({...this.state, loadResults:false})
            }}
            onValueSelected = {(value) => {
              if(value != '' && value != null) {
                this.setState({...this.state, loadResults:true});
              }
              else {                
                this.setState({...this.state, loadResults:false});
              }
            }}
            innerClass={{
              "input": "searchbox",
              "list": "suggestionlist"
            }}
          /> 
        </div>
          <div className={"display"}>
            <div className={"leftSidebar"}>
            <h2>Knowledgebase</h2>
            {!this.state.loadResults && <div> No Results found. </div>}
            { this.state.loadResults &&
            <ReactiveList
              componentId="results"
              react={{
                  and: ['mainSearch'],
              }}
              render={({ data }) => (
                  <ReactiveList.ResultCardsWrapper>
                      {data.map(item => (
                        item.Endpoint == 'Confluence' &&                        
                        <ResultCard key={item._id}>
                            <ResultCard.Title
                                dangerouslySetInnerHTML={{
                                    __html: item.Team
                                }}
                            />
                            <ResultCard.Description>
                                <div> 
                                    <a href={item.URL1}>{item.URL1Title1}</a>
                                </div>
                            </ResultCard.Description>
                            <ResultCard.Description>
                                <div> 
                                    <a href={item.URL2}>{item.URL2Title2}</a>
                                </div>
                            </ResultCard.Description>
                            <ResultCard.Description>
                                <div> 
                                    <a href={item.URL3}>{item.URL3Title3}</a>
                                </div>
                            </ResultCard.Description>
                        </ResultCard>
                      ))}
                  </ReactiveList.ResultCardsWrapper>
              )}
            />
            }
            </div>  
          </div>
          
          <div className={"mainBar"}>
            <h2>Incidents</h2>
            {!this.state.loadResults && <div> No Results found. </div>}
            { this.state.loadResults &&
            <ReactiveList
              componentId="results"
              size={5}
              pagination={true}
              react={{
                  and: ['mainSearch'],
              }}
              render={({ data }) => (
                  <ReactiveList.ResultCardsWrapper>
                      {data.map(item => (                        
                          <React.Fragment> 
                            {item.Endpoint == 'ServiceNow' &&
                              <ResultList key={item._id}>
                                <ResultList.Content>
                                  <ResultList.Title
                                      dangerouslySetInnerHTML={{
                                          __html: item.Description,
                                      }}
                                  />
                                  <ResultList.Description>
                                    <div>
                                      <ul style={{'list-style-type': 'none'}}>
                                      <li><b>{'IncidentId: ' + item.IncidentId}</b></li>
                                      <li>{'Assigned To: '+ item.AssignedTo}</li>
                                      <li>{'Priority: '} <span style={{color: item.Priority == 'High'? 'purple': 'black'}}>{item.Priority}</span> </li>
                                      {!!item.ResolutionNotes && <li>{'Resolution Notes: '+ item.ResolutionNotes}</li>}
                                      <li style={{color: item.State == 'Closed'? 'green': 'red'}}>{item.State}</li>
                                      </ul>
                                    </div>
                                  </ResultList.Description>
                                  </ResultList.Content>
                              </ResultList>
                            }  
                            {/* Todo: Gauri can you modify the following so that it looks like a seperate section?*/}
                            {item.IncidentId == item.RelatedIncidentId && item.IncidentId != null &&
                            <ResultList  style={{'background-color':'aliceblue'}}> <h2><em>Related Incidents </em></h2></ResultList>
                            }
                          </React.Fragment>
                      ))}
                  </ReactiveList.ResultCardsWrapper>
              )}
            />
            }
          </div>
        
        </ReactiveBase>
      </div>
    );
  }
}
export default Main;