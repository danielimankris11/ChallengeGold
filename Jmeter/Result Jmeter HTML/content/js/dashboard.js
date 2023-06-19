/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 61.53846153846154, "KoPercent": 38.46153846153846};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5384615384615384, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Post Register"], "isController": false}, {"data": [0.0, 500, 1500, "Post Create employees"], "isController": false}, {"data": [0.0, 500, 1500, "Delete employees"], "isController": false}, {"data": [1.0, 500, 1500, "Put Employees"], "isController": false}, {"data": [0.0, 500, 1500, "Post Change Password"], "isController": false}, {"data": [1.0, 500, 1500, "Get Dasboard Direktur"], "isController": false}, {"data": [0.0, 500, 1500, "Get All User"], "isController": false}, {"data": [1.0, 500, 1500, "Get Dasboard"], "isController": false}, {"data": [1.0, 500, 1500, "Get Grade By ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Grades"], "isController": false}, {"data": [0.0, 500, 1500, "Post Forgot Password"], "isController": false}, {"data": [1.0, 500, 1500, "Get Detailed employees"], "isController": false}, {"data": [0.0, 500, 1500, "Post Login"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 26, 10, 38.46153846153846, 637.5769230769231, 295, 4349, 372.5, 1366.6000000000022, 4008.7999999999984, 4349.0, 1.8490861247421946, 16.17936468778892, 0.46213262748026457], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Post Register", 2, 0, 0.0, 408.0, 371, 445, 408.0, 445.0, 445.0, 445.0, 0.2959017606154757, 0.1352363515312916, 0.07339750702766681], "isController": false}, {"data": ["Post Create employees", 2, 2, 100.0, 406.0, 307, 505, 406.0, 505.0, 505.0, 505.0, 0.2972209838014564, 0.2144983467082776, 0.15093253083667707], "isController": false}, {"data": ["Delete employees", 2, 2, 100.0, 337.5, 300, 375, 337.5, 375.0, 375.0, 375.0, 0.29338418659234267, 0.22662782382279595, 0.05644207495965967], "isController": false}, {"data": ["Put Employees", 2, 0, 0.0, 321.5, 311, 332, 321.5, 332.0, 332.0, 332.0, 0.2961208172934557, 0.23163356899615045, 0.150373852531833], "isController": false}, {"data": ["Post Change Password", 2, 2, 100.0, 302.5, 297, 308, 302.5, 308.0, 308.0, 308.0, 0.30088761847449974, 0.20539105987663606, 0.07404656235895893], "isController": false}, {"data": ["Get Dasboard Direktur", 2, 0, 0.0, 422.5, 374, 471, 422.5, 471.0, 471.0, 471.0, 0.3107037439801149, 0.6305101367096473, 0.059774060121174456], "isController": false}, {"data": ["Get All User", 2, 0, 0.0, 3863.0, 3377, 4349, 3863.0, 4349.0, 4349.0, 4349.0, 0.21404109589041095, 21.679812914704623, 0.03657928884845891], "isController": false}, {"data": ["Get Dasboard", 2, 0, 0.0, 449.0, 435, 463, 449.0, 463.0, 463.0, 463.0, 0.30646644192460926, 0.17328522448666872, 0.05626532332209623], "isController": false}, {"data": ["Get Grade By ID", 2, 0, 0.0, 367.0, 352, 382, 367.0, 382.0, 382.0, 382.0, 0.31036623215394166, 0.8456267458100559, 0.05698130043451272], "isController": false}, {"data": ["Get All Grades", 2, 0, 0.0, 382.0, 305, 459, 382.0, 459.0, 459.0, 459.0, 0.30670142616163165, 0.31538730639472473, 0.05151625517558657], "isController": false}, {"data": ["Post Forgot Password", 2, 2, 100.0, 351.5, 295, 408, 351.5, 408.0, 408.0, 408.0, 0.30152268958239103, 0.20582457033016735, 0.06919710161314639], "isController": false}, {"data": ["Get Detailed employees", 2, 0, 0.0, 354.0, 305, 403, 354.0, 403.0, 403.0, 403.0, 0.3021604471974618, 0.4452735496298535, 0.0525239839854963], "isController": false}, {"data": ["Post Login", 2, 2, 100.0, 324.0, 305, 343, 324.0, 343.0, 343.0, 343.0, 0.29881966233378154, 0.1616661063797998, 0.07324583520095623], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 2, 20.0, 7.6923076923076925], "isController": false}, {"data": ["401", 2, 20.0, 7.6923076923076925], "isController": false}, {"data": ["500", 6, 60.0, 23.076923076923077], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 26, 10, "500", 6, "400", 2, "401", 2, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Post Create employees", 2, 2, "500", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Delete employees", 2, 2, "400", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Post Change Password", 2, 2, "500", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Post Forgot Password", 2, 2, "500", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Post Login", 2, 2, "401", 2, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
