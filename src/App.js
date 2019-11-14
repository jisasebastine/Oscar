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
            onValueChange = {(value) => { value == ''? 
              this.setState({...this.state, loadResults:false}) :
              this.setState({...this.state, loadResults:true})
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
            {!this.state.loadResults && <div> <p> No results. Please use the searchbox </p> </div>}
            { this.state.loadResults &&
            <ReactiveList
              componentId="results"
              dataField={['Description','URL1','URL1Title1','URL2','URL2Title2','URL3','URL3Title3','Team']}
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
            {!this.state.loadResults && <div> <p> No results. Please use the searchbox </p> </div>}
            { this.state.loadResults &&
            <ReactiveList
              componentId="results"
              dataField={['Description','IncidentId']}
              size={5}
              pagination={true}
              react={{
                  and: ['mainSearch'],
              }}
              render={({ data }) => (
                  <ReactiveList.ResultCardsWrapper>
                      {data.map(item => (                        
                          <React.Fragment>                          
                            {/* {item.IncidentId !== item.RelatedIncidentId &&
                            <div> Related Incidents </div>
                            } */}
                            {item.Endpoint == 'ServiceNow' &&
                              <ResultList key={item._id}>
                                  <ResultList.Title
                                      dangerouslySetInnerHTML={{
                                          __html: item.Description,
                                      }}
                                  />
                                  <ResultList.Description>
                                      {item.IncidentId + ' ' + '*'.repeat(item.Description)}
                                  </ResultList.Description>
                              </ResultList>
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