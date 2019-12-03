import React from 'react';
import { ReactiveList, DataSearch, ResultList } from '@appbaseio/reactivesearch';


class RelatedIncident extends React.Component {
    render() {
        var data = this.props.searchKeyword;
        var newSearchKeyword = !!data? data[0]: {};
        !!newSearchKeyword && console.log("Data: ", newSearchKeyword.Description);
        if(!!newSearchKeyword) return(
            <div>
                <ResultList className="related"> <h2><em>Related Incidents </em></h2></ResultList>
                <div style={{visibility:'hidden'}}>
                <DataSearch
                    componentId="relatedIncidentSearch"
                    defaultValue={newSearchKeyword.Description}
                    dataField={["Description", "Team", "Title"]}
                    queryFormat="or"
                    showIcon={false}
                    innerClass={{
                    "input": "searchbox",
                    "list": "suggestionlist"
                    }}>
                </DataSearch>
                </div>
                <ReactiveList
                componentId="relatedIncidents"
                pagination={false}
                react={{
                    and: ['relatedIncidentSearch'],
                }}
                render={({ data }) => (
                    <ReactiveList.ResultCardsWrapper>
                        {data.map(item => (                        
                            <React.Fragment> 
                              {item.Endpoint == 'ServiceNow' && item.IncidentId != newSearchKeyword.IncidentId &&
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
            </div>
        );
        else return (            
            <ResultList  className="related"> <h2><em>No Related Incidents </em></h2></ResultList>
        );
    }
}

export default RelatedIncident;