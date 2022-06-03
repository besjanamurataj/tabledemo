import axios from 'axios';

const ROOT_URL =
  'http://192.168.0.130:8080/grossdemanddeterminationtotal/IT/2022/2022/1/12';
export async function update(arr) {
  return new Promise(function (resolve, reject) {
    axios.put(
      'http://192.168.0.130:8080/grossdemanddeterminationtotal/update', arr,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          'Access-Control-Allow-Credentials': true,
          crossorigin: true,
        },
      },
      (error) => {
        reject(error);
      }
    ).then(function (response) {
      resolve(response);
    });
  });
}


export async function getAll(tenant,yearFrom,yearTo,monthFrom,monthTo) {
  return new Promise(function (resolve, reject) {
    axios.get
      (`http://192.168.0.130:8080/grossdemanddeterminationtotal/${tenant}/${yearFrom}/${yearTo}/${monthFrom}/${monthTo}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          'Access-Control-Allow-Credentials': true,
          crossorigin: true,
        },
      },
      (error) => {
        reject(error);
      }
    ).then(function (response) {
      resolve(response.data);
    });
  });
}
export async function get() {
  var str = await getAll();
  if (str !== undefined) {
    var channels = str.gddtPerChannel;
    var rows = new Array();
    Object.keys(channels).map((elements) => {
      rows = rows.concat(buildRow(channels[elements]));
      console.log(rows,'rows')
    });
    return rows;
  }
}

export async function frezzenYear(tenant,yearToFreeze){
  return new Promise(function (resolve, reject) {
    axios.put
      (`http://192.168.0.130:8080/grossdemanddeterminationtotal/freezeyear/${tenant}/${yearToFreeze}`,
      {
      
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          'Access-Control-Allow-Credentials': true,
          crossorigin: true,
        },
      },
      (error) => {
        reject(error);
      }
    ).then(function (response) {
      resolve(response.data);
    });
  });
}



function buildRow(elements) {
  var arraychannel = new Array();
  arraychannel.push(buildDatas(elements, 'budget'));
  arraychannel.push(buildDatas(elements, 'rf'));
  arraychannel.push(buildDatas(elements, 'rfProposal'));
  arraychannel.push(buildDatas(elements, 'actual'));
  arraychannel.push(buildDatas(elements, 'actualVsRF'));
  arraychannel.push(buildDatas(elements, 'rfVsBgt'));
  return arraychannel;
}

function buildDatas(element, row) {
  var tabData = {};
  var arrayMesi = new Array();
  for (let index = 1; index <= 12; index++) {
    arrayMesi.push(index);
  }
  if (row === 'budget') {
    tabData.mainType = element[0].channel;
  } else {
    tabData.mainType = '';
  }
  tabData.subType = row;
  arrayMesi.forEach((month) => {
    var obj = element.find((ele) => ele.month === month);
    if (obj !== undefined) {
      if(obj.id === null) {
        tabData.id = obj.month + Math.round(Math.random()*100001 + 1);
        
        console.log(tabData.id,'id')
      } else {
        tabData.id = obj.id + '-' + row + '-' + obj.channel;
      }
      if(obj[row] !== null) {
        tabData[month] = obj[row].toString();
      } else {
        tabData[month] = obj[row];
      }
    }
  });
  var obj1 = element.find((ele) => ele.month === null);
    if (obj1[row] !== null) {
      tabData.fullYear = obj1[row].toString();
    } else {
      tabData.fullYear = obj1[row]
    }
    
  
  return tabData;
}

