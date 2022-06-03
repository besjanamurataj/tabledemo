import { FileDownloadRounded, KeyboardArrowLeft, KeyboardArrowRight, LockRounded } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Typography, useTheme } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from "react";
import * as XLSX from 'xlsx'
import { getAll,frezzenYear,update} from './service.js';


function DemoTable(){
  const [year, setYear] = useState(2022);  
  const [rowColorPast, setRowColorPast] = useState('#F5F5F5');
  const [rowColorFuture, setRowColorFuture] = useState("rgb(25,118,210,0.15)");
    const getCurrentYear = (month) => {
        const d = new Date();
        let currentMonth = d.getMonth() + 1;
        let currentYear = d.getFullYear();
       if (year === 2023) {
          return true;
        }
        else if (currentYear === year && month >= currentMonth) {
       
          return true;
        }  
        else{
          return false;
        }
      };
    const columns = [{
        field: "mainType", headerName: "", flex: 1, cellClassName: (params) => {return params.row.subType === 'RF vs Budget' ? 'default borderBottom' : 'default'}},
        {field: "subType", headerName: "", flex: 1, cellClassName: (params) => {return params.row.subType === 'rfProposal' ? 'rfProposal' : params.row.subType === 'RF vs Budget' ? 'borderBottom' : ''}},
        {field: "1", headerName: "Jan", editable: getCurrentYear(1), flex: 1, cellClassName: (params) => {return params.row.subType === 'rfProposal' ? 'PRF' : params.row.subType === 'rfVsBgt' ? 'past borderBottom' : 'past'}},
        {field: "2", headerName: "Feb", editable: getCurrentYear(2), flex: 1, cellClassName: (params) => {return params.row.subType === 'rfProposal' ? 'PRF' : params.row.subType === 'rfVsBgt' ? 'past borderBottom' : 'past'}},
        {field: "3", headerName: "Mar", editable: getCurrentYear(3), flex: 1, cellClassName: (params) => {return params.row.subType === 'rfProposal' ? 'PRF' : params.row.subType === 'rfVsBgt' ? 'past borderBottom' : 'past'}},
        {field: "4", headerName: "Apr", editable: getCurrentYear(4), flex: 1, cellClassName: (params) => {return params.row.subType === 'rfProposal' ? 'PRF' : params.row.subType === 'rfVsBgt' ? 'past borderBottom' : 'past'}},
        {field: "5", headerName: "May", editable: getCurrentYear(5), flex: 1, cellClassName: (params) => {return params.row.subType === 'rfProposal' ? 'PRF' : params.row.subType === 'rfVsBgt' ? 'past borderBottom' : 'past'}},
        {field: "6", headerName: "Jun", editable: getCurrentYear(6), flex: 1, cellClassName: (params) => {return params.row.subType === 'rfProposal' ? 'PRF' : params.row.subType === 'rfVsBgt' ? 'past borderBottom' : 'past'}},
        {field: "7", headerName: "Jul", editable: getCurrentYear(7), flex: 1, cellClassName: (params) => {return params.row.subType === 'rfProposal' ? 'PRF' : params.row.subType === 'rfVsBgt' ? 'future borderBottom' : 'future'}},
        {field: "8", headerName: "Aug", editable: getCurrentYear(8), flex: 1, cellClassName: (params) => {return params.row.subType === 'rfProposal' ? 'PRF' : params.row.subType === 'rfVsBgt' ? 'future borderBottom' : 'future'}},
        {field: "9", headerName: "Sep", editable: getCurrentYear(9), flex: 1, cellClassName: (params) => {return params.row.subType === 'rfProposal'? 'PRF' : params.row.subType === 'rfVsBgt' ? 'future borderBottom' : 'future'}},
        {field: "10", headerName: "Oct", editable: getCurrentYear(10), flex: 1, cellClassName: (params) => {return params.row.subType === 'rfProposal' ? 'PRF' : params.row.subType === 'rfVsBgt' ? 'future borderBottom' : 'future'}},
        {field: "11", headerName: "Nov", editable: getCurrentYear(11), flex: 1, cellClassName: (params) => {return params.row.subType === 'rfProposal' ? 'PRF' : params.row.subType === 'rfVsBgt' ? 'future borderBottom' : 'future'}},
        {field: "12", headerName: "Dec", editable: getCurrentYear(12), flex: 1, cellClassName: (params) => {return params.row.subType === 'rfProposal' ? 'PRF' : params.row.subType === 'rfVsBgt' ? 'future borderBottom' : 'future'}},
        {field: "fullYear", headerName: "Full Year", flex: 1, cellClassName: (params) => {return params.row.subType === 'PRF' ? 'PRF' : params.row.subType === 'RF vs Budget' ? 'past borderBottom' : 'fullYear'}}];

    const [rows, setRows] = useState([]);
    const [color, setColor] = useState("rgb(25,118,210)");

    const [mappaResp, setMappaResp] = useState([]);
    const [arrUpdate, setArrUpdate] = useState([]);
    
    function downloadExcel(){
      const workSheet = XLSX.utils.json_to_sheet(rows);
      const workBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook,workSheet,'Table.xlsx');
      let buf = XLSX.write(workBook,{bookType:"xlsx",type:"buffer"});
      XLSX.write(workBook,{bookType:"xlsx", type:"binary"});
      XLSX.writeFile(workBook,"Table.xlsx")
     }


    async function getRows() {
        var response = await getAll("IT",2022,2022,1,12)
        setMappaResp(response);
        setRows(manageData(response));
    }

    function manageData(response) {
        if (response !== undefined) {
          console.log(response,'response')
          var channels = response.gddtPerChannel;
          var rows = new Array();
          Object.keys(channels).map((elements) => {
            rows = rows.concat(buildRow(channels[elements]));
          });
          return rows;
        }
      }
      function buildRow(elements) {
        var arraychannel = new Array();
        arraychannel.push(buildDatas(elements, 'budget'));
        arraychannel.push(buildDatas(elements, 'rf'));
        arraychannel.push(buildDatas(elements, 'rfProposal'));
        arraychannel.push(buildDatas(elements, 'actual'));
        arraychannel.push(buildDatas(elements, 'actualVsRF'));
        arraychannel.push(buildDatas(elements, 'rfVsBgt'));
        console.log(arraychannel,'arraychannel')
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


      async function previosYear () {
        if (year === 2023) {
          getRows();
          setYear(2022);
          setRowColorPast('#F5F5F5');
          setRowColorFuture('#cecdcd');
          setColor("rgb(25,118,210)");
        } else if (year === 2022) {
          setYear(2021);
          var response = await getAll("IT",2021,2021,1,12)
          setMappaResp(response);
          setRows(manageData(response));
          setColor("rgb(170 ,29, 236)");
        }
      };
    
      async function nextYear(){
        if (year === 2021) {
          setYear(2022);
          getRows();
          setColor("rgb(25,118,210)");
        } else if (year === 2022) {
          setYear(2023);
          setColor("rgb('76,175,80')");
          setRowColorPast('#a9e7a9');
          setRowColorFuture('#a9e7a9');
          var response = await getAll("IT",2023,2023,1,12)
          setMappaResp(response);
          setRows(manageData(response));
        
        }
      };

      async function frezzenYears() {
        await frezzenYear('IT',2022);
    }
      

    useEffect(() => {
        getRows();
    }, []);
  
    const CustomToolbar = () => {
        return (
            <Grid container p={1} style={{
                color: useTheme().palette.primary.contrastText,
                backgroundColor: color,
            }} alignItems="center">
                <Grid item xs><Typography variant="h6">{year}</Typography></Grid>
                <Grid item xs="auto" ><Button startIcon={<LockRounded/>} onClick ={frezzenYears}
                                             style={{color: useTheme().palette.primary.contrastText}}>FREEZE
                    YEAR</Button></Grid>
                    <p style={{height:3}}>
                  </p>
                    
                 <Grid item xs="auto"><IconButton aria-label="export"  onClick ={downloadExcel}
                                                 style={{color: useTheme().palette.primary.contrastText}} ><FileDownloadRounded/></IconButton></Grid> 
            </Grid>
        );
    }

    const handleOnCellEditCommit= (params) => {
      console.log(params,'params')
        if (params.value !== params.formattedValue) {
            var srrString = params.id.split('-');
            var arrEle = mappaResp.gddtPerChannel[srrString[2]];
            var objectUpd = arrEle.find(e => e.month === Number(params.field));
            console.log(objectUpd,'UPJECTuPD')
            if (objectUpd !== undefined) {
                var dataUpdate;
                var obgFound = arrUpdate.find(obj => obj.id === objectUpd.id);
                if (obgFound !== undefined) {
                    if (srrString[1] === 'rf') {
                        obgFound.rf = Number(params.value);
                    } else if (srrString[1] === 'budget') {
                        obgFound.budget = Number(params.value);
                    }
                } else {
                    if (srrString[1] === 'rf') {
                        dataUpdate = {id: objectUpd.id, rf: Number(params.value)};
                    } else if (srrString[1] === 'budget') {
                        dataUpdate = {id: objectUpd.id, budget: Number(params.value)};
                    }
                
                   arrUpdate.push(dataUpdate);
                }
            }
        }
      };

    async   function updateTable() {
      console.log(arrUpdate,'arrupdate12')
          await update(arrUpdate);
          getRows()
        //console.log(response)
      }

      const CustomFooter = () => {
        return (
          <Grid
            container
            p={1}
            style={{
              color: useTheme().palette.primary.main,
            }}
            justifyContent="flex-end"
            alignItems="center"
          >
            <Grid item xs="auto">
              <IconButton aria-label="export" onClick={previosYear}>
                <KeyboardArrowLeft />
              </IconButton>
            </Grid>
            <Grid item xs="auto">
              <Typography variant="h6" style={{ color: color }}>
                {year}
              </Typography>
            </Grid>
            <Grid item xs="auto">
              <IconButton aria-label="export" onClick={nextYear}>
                <KeyboardArrowRight />
              </IconButton>
            </Grid>
          </Grid>
        );
      };


    return (
        <Box
            sx={{
             
                minHeight: '20vh',
                padding: 5,
                '& .default': {
                  fontWeight: 550,
                    backgroundColor: '#cecdcd',
                    'white-space': 'break-spaces !important'
                },
                '& .past': {
                  backgroundColor :  rowColorPast 
              },
              '& .future': {
                backgroundColor :rowColorFuture
              },
                '& .PRF': {
                  backgroundColor : '#f2f2f2' 
                },
                '& .fullYear':{
                  backgroundColor : '#f5f5f5' 
                },
                '& .borderBottom': {
                    borderBottom: '2px solid red' + useTheme().palette.primary.main + '!important'
                },
            }}
        >
            <DataGrid isCellEditable={(params) =>params.row?.subType === "budget" || params.row.subType === "rf"} density={"compact"} autoHeight {...rows} rows={rows} columns={columns} onCellEditCommit={handleOnCellEditCommit} disableSelectionOnClick
             components={{Toolbar: CustomToolbar, Footer: CustomFooter}}
             />
            <div style ={{float: 'right'}}>
             <Button variant="contained" onClick={updateTable}>Save</Button>
             <Button variant="outlined" disabled sx= {{padding: 1, margin: 1}}>Cancel</Button>
            </div>
        </Box>
    );
}

export default DemoTable;
