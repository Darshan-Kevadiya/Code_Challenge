import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Chart from 'react-apexcharts';
import { Button } from 'react-bootstrap';

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
        show: true
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
  const [enteries, setenteries] = useState(10)
  const [response, setresponse] = useState('')
  const [offset, setoffset] = useState('')
  const [offsetarray, setoffsetarray] = useState([])
  
  
  useEffect(() => {
    axios.get(`https://api.airtable.com/v0/appBTaX8XIvvr6zEC/Users?pageSize=${enteries}${offset && `&offset=${offset}`}`,
      {
        headers: {
          'Authorization': 'Bearer key4v56MUqVr9sNJv'
        }
      }
    ).then(x => {
      setdata(x.data.records);
      console.log(x.data.offset);
      setresponse(x.data)
      !x.data.offset && offsetarray.pop()
    })

    
    axios.get('/assets/logs.json').then(({ data }) => {
      setLogsData(data)
    })

  }, [enteries , offset])

  const handleEnteries =(e) =>{
    setenteries(e.target.value);
  }
  const handlenext = () =>{
    console.log(response.offset);
    setoffset(response.offset)
    setoffsetarray(prevstate => ([...prevstate , response.offset]))
  }
  const handleprevious = () =>{
    setoffset(offsetarray.length > 0 ? offsetarray.pop() : ' ')
    offsetarray.length == 0 &&  setoffset('')
  }

  // console.log(data);
  // console.log("response offset" ,response.offset);
  // console.log("offset array",offsetarray);
  // console.log("offset array",offsetarray.length);
  // console.log("offset",offset);

  
  return (
    <div>
      <div className='container d-flex justify-content-between my-2'>
        <div className='d-flex align-items-center'>
       <h5 className='m-0'>Show</h5>
        <select class="form-select mx-2" onChange={handleEnteries}>
          <option value='10'>10</option>
          <option value='25'>25</option>
          <option value='50'>50</option>
          <option value='100'>100</option>
        </select>
        <h5 className='m-0'>enteries</h5>
        </div>
        <div>
          <Button onClick={handleprevious} disabled={offsetarray.length > 0 ? false : true}>Previous</Button>
          <Button onClick={handlenext} disabled={response.offset ? false : true}>Next</Button>
        </div>
      </div>
      <div className='container d-flex row g-0 mx-auto'>
        {
          data.map(x => {
            return <div className=' col-12 col-sm-6 col-xl-4 p-2 card-group'>
              <div className=' p-2 d-flex flex-column card justify-content-between'>
                <div className='d-flex flex-sm-column align-items-center align-items-md-start flex-md-row w-100'>
                  <div className='col-3' >
                    <div style={{ width: '70px', height: '70px', borderRadius: '50%', border: '2px solid', color: 'white', background: 'rgb(127, 140, 141)' }} className='d-flex justify-content-center align-items-center fs-3'>
                      <span>{Firstletter(x.fields.Name)}</span>
                    </div>
                  </div>
                  <div className='user-name col-9 col-sm-12 col-md-9 d-flex flex-column justify-content-center h-100 text-start ps-1'>
                    <h4 className='m-0 heading-color fw-bolder text-sm-center text-md-start'>{x.fields.Name}</h4>
                    <p className='m-0 text-muted fw-bolder text-sm-center text-md-start'>{x.fields.occupation}</p>
                  </div>
                </div>
                <div className='d-flex'>
                  <div className='col-6 col-lg-7 d-flex flex-column justify-content-between'>
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
                  <div className='col-6 col-lg-5 text-end'>
                    <h6 className='m-0 orange-color fw-bold fs-6 fs-lg-5'>{ parseFloat(logsData.filter(y => y.type == 'impression' && y.user_id == x.fields.Id).map(y => y.revenue).reduce((a, b) => a + b, 0)).toFixed(2) }</h6>
                    <span className='m-0 text-muted' style={{ fontSize: '14px' }}>impressions  </span>
                    <h6 className='m-0 blue-color fw-bold fs-6 fs-lg-5'>{  parseFloat(logsData.filter(y => y.type == 'conversion' && y.user_id == x.fields.Id).map(y => y.revenue).reduce((a, b) => a + b, 0)).toFixed(2) }</h6>
                    <span className='m-0 text-muted' style={{ fontSize: '14px' }}>conversion  </span>
                    <h6 className='m-0 green-color fw-bold fs-5 fs-lg-4'>${ parseFloat(logsData.filter(y => y.user_id == x.fields.Id).map(y => y.revenue).reduce((a, b) => a + b, 0)).toFixed(2) }</h6>
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