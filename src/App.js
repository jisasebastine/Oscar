import React from 'react';
import { ReactiveBase, DataSearch, ResultCard, ReactiveList, ResultList } from '@appbaseio/reactivesearch';
import './App.css';
import config from './config';

class Main extends React.Component {
  state = {
    loadResults : false,
    showImageForIncident : false,
    showImage : false
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
          <span className="inc">INC</span><span className="pedia">yclopedia</span>
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
              console.log(value); 
              if(value != '' && value != null) {
                this.setState({...this.state, loadResults:true});
              }
              else {                
                this.setState({...this.state, loadResults:false, showImage: false});
              }
              if(value == 'INC4024785') {
                this.setState({...this.state, loadResults:true, showImageForIncident:true, showImage: true});
              }
              else if(value === 'dsa product quantity vp mismatch') {
                this.setState({...this.state, loadResults:true, showImageForIncident:false, showImage: true});
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
                        <ResultList key={item._id}>
                          <ResultList.Content>
                            <ResultList.Title
                                dangerouslySetInnerHTML={{
                                    __html: item.Team
                                }}
                            />
                            <ResultList.Description>
                              
                            <div className="knw-description">
                              <ul className="list">                                
                                <li> 
                                    <a href={item.URL1}>{item.URL1Title1}</a>
                                </li>
                                <li> 
                                    <a href={item.URL2}>{item.URL2Title2}</a>
                                </li>
                                <li> 
                                    <a href={item.URL3}>{item.URL3Title3}</a>
                                </li>
                              </ul>
                              </div>
                            </ResultList.Description>
                            </ResultList.Content>
                        </ResultList>
                      ))}
                  </ReactiveList.ResultCardsWrapper>
              )}
            />
            }
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
                                    <div className="description">
                                      <ul style={{'list-style-type': 'none'}}>
                                      <li><b>{'IncidentId: ' + item.IncidentId}</b></li>
                                      <li>{'Assigned To: '+ item.AssignedTo}</li>
                                      {!!item.Region && <li>{'Region: '+ item.Region}</li>}
                                      <li>{'Priority: '} <span style={{color: item.Priority == 'High'? 'red': '#9f09a9c9'}}>{item.Priority}</span> </li>
                                      {!!item.ResolutionNotes && <li>{'Resolution Notes: '+ item.ResolutionNotes}</li>}
                                      <li style={{color: item.State == 'Closed'? 'green': 'red'}}>{item.State}</li>
                                      </ul>
                                    </div>
                                  </ResultList.Description>
                                  </ResultList.Content>
                              </ResultList>
                            }  
                            {item.IncidentId == item.RelatedIncidentId && item.IncidentId != null &&
                            <ResultList  className="related"> <h2><em>Related Incidents </em></h2></ResultList>
                            }
                          </React.Fragment>
                      ))}
                  </ReactiveList.ResultCardsWrapper>
              )}
            />
            }    
            </div>
            {this.state.showImage && 
            <div className={"rightSidebar"}>
            <div className="vertical">
            <div><h3>Teams Involved</h3></div>
              <div><img src={this.state.showImageForIncident? "incident_team.png": "keyword_team.png"} width="200"/></div>
              <div><h3>Regions Impacted</h3></div>
              <div><img src={this.state.showImageForIncident? "incident_region.png": "keyword_region.png"} width="200"/></div>
            </div>
            </div> } 
          </div>
        
        </ReactiveBase>
      </div>
    );
  }
}
export default Main;