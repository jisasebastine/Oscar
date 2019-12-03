import React from 'react';
import { ReactiveBase, DataSearch, ResultCard, ReactiveList, ResultList } from '@appbaseio/reactivesearch';
import './App.css';
import config from './config';
import Doghnut from './Chart';
import RelatedIncident from './RelatedIncident';

class Main extends React.Component {
  state = {
    loadResults : false,
    showImage : false,
    showRelatedIncidents: false
  }
  render() {
    console.log(this.state);
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
            dataField={["IncidentId", "Description", "Team", "Title"]}
            queryFormat="or"
            placeholder="Search by Incident ID or Keyword..."
            className="datasearch"
            onValueChange = {(value) => { 
              if(value == '') this.setState({...this.state, loadResults:false, showImage:false, showRelatedIncidents:false})
            }}
            onValueSelected = {(value) => { 
              console.log(value); 
              if(value != '' && value != null) {
                this.setState({loadResults:true, showImage: true});
              }else {
                this.setState({loadResults:false, showImage:false, showRelatedIncidents:false})
              }       
              
              // show related incidents  
              const regex = new RegExp('^INC[0-9]+$'); // if it is an Incident Id
              if(!!value.match(regex)) {
                this.setState({
                  showRelatedIncidents: true});
              } else {
                this.setState({ 
                  showRelatedIncidents: false});
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
                componentId="knowledgebase"
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
              { !this.state.loadResults && <div> No Results found. </div>}
              { this.state.loadResults &&
              <React.Fragment>
                <ReactiveList
                  componentId="incidents"
                  size={4}
                  pagination={!this.state.showRelatedIncidents && true}
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
                              </React.Fragment>
                          ))}
                      </ReactiveList.ResultCardsWrapper>
                  )}>
                </ReactiveList>
                {!!this.state.showRelatedIncidents && 
                <ReactiveList
                  componentId="relatedIncidentComponent"
                  react={{
                    and: ['mainSearch'],
                  }}
                  render = {({data}) => (
                    <RelatedIncident searchKeyword={data}/>
                  )}
                ></ReactiveList> }
              </React.Fragment>
              }    
              </div>
            <div className="rightSidebar">
              <div className="vertical">  
              {this.state.showImage &&
              <ReactiveList
                componentId="charts"
                react={{
                    and: ['mainSearch'],
                }}
                render={({ data }) => (
                  <Doghnut results={data}/>
                )}>
              </ReactiveList> 
              }             
              </div>
            </div>
          </div>
        
        </ReactiveBase>
      </div>
    );
  }
}
export default Main;