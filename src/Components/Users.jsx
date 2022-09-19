import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Chart from 'react-apexcharts';

const Users = () => {
  const chart2Options = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: true
      }
    },
    grid: {
      padding: {
        right: 6,
        left: 6
      }
    },
    tooltip: {
      fixed: {
        enabled: true
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter() {
            return 'Revenue: $';
          }
        }
      },
      marker: {
        show: false
      }
    },
    legend: {
      show: false
    }
  };
  const chart4Data = [
    {
      name: 'Tests',
      data: [24, 54, 38, 47, 56, 47, 45, 56, 38, 56, 24, 38, 24, 65]
    }
  ];

  const Firstletter = (x) => {
    return (x.split('')[0]);
  }

  const [data, setdata] = useState([])
  const [logsData, setLogsData] = useState([])

  useEffect(() => {
    axios.get('https://api.airtable.com/v0/appBTaX8XIvvr6zEC/Users?maxRecords=12',
      {
        headers: {
          'Authorization': 'Bearer key4v56MUqVr9sNJv'
        }
      }
    ).then(x => setdata(x.data.records))

    //  
    axios.get('/assets/logs.json').then(({ data }) => {
      setLogsData(data)
    })
  }, [])

  console.log(data);
  return (
    <div>
      <div className='container d-flex row g-0 mx-auto'>
        {
          data.map(x => {
            return <div className='col-4 p-2'>
              <div className=' p-2 d-flex flex-column card'>
                <div className='d-flex w-100'>
                  <div className='col-3' >
                    <div style={{ width: '70px', height: '70px', borderRadius: '50%', border: '2px solid', color: 'white', background: 'rgb(127, 140, 141)' }} className='d-flex justify-content-center align-items-center fs-3'>
                      <span>{Firstletter(x.fields.Name)}</span>
                    </div>
                  </div>
                  <div className='user-name col-9 d-flex flex-column text-start'>
                    <h4 className='m-0 heading-color fw-bolder'>{x.fields.Name}</h4>
                    <p className='m-0 text-muted fw-bolder'>{x.fields.occupation}</p>
                  </div>
                </div>
                <div className='d-flex'>
                  <div className='col-7 d-flex flex-column justify-content-between'>
                    <div>
                      <Chart
                        options={chart2Options}
                        series={chart4Data}
                        type="line"
                        height={100}
                      />
                    </div>
                    <span className='text-muted' style={{ fontSize: '12px' }}>Conversion 4/12 - 4/30</span>
                  </div>
                  <div className='col-5 text-end'>
                    <h6 className='m-0 orange-color fw-bold fs-5'>{ parseFloat(logsData.filter(y => y.type == 'impression' && y.user_id == x.fields.Id).map(y => y.revenue).reduce((a, b) => a + b, 0)).toFixed(2) }</h6>
                    <span className='m-0 text-muted' style={{ fontSize: '14px' }}>impressions  </span>
                    <h6 className='m-0 blue-color fw-bold fs-5'>{  parseFloat(logsData.filter(y => y.type == 'conversion' && y.user_id == x.fields.Id).map(y => y.revenue).reduce((a, b) => a + b, 0)).toFixed(2) }</h6>
                    <span className='m-0 text-muted' style={{ fontSize: '14px' }}>conversion  </span>
                    <h6 className='m-0 green-color fw-bold fs-4'>${ parseFloat(logsData.filter(y => y.user_id == x.fields.Id).map(y => y.revenue).reduce((a, b) => a + b, 0)).toFixed(2) }</h6>
                  </div>
                </div>
              </div>
            </div>
          })
        }
      </div>
    </div>
  )
}

export default Users