
var module = angular.module("example", ["angularGrid"]);

module.controller("exampleCtrl", function($scope, $http) {

    var FLAG_CODES = {
        'Ireland': 'ie',
        'United States': 'us',
        'Russia': 'ru',
        'Australia': 'au',
        'Canada': 'ca',
        'Norway': 'no',
        'China': 'cn',
        'Zimbabwe': 'zw',
        'Netherlands': 'nl',
        'South Korea': 'kr',
        'Croatia': 'hr',
        'France': 'fr'
    };

    var columnDefs = [
        {displayName: "Athlete", field: "athlete", width: 200, cellStyle: {'padding-left': '40px'} },
        {displayName: "Age", field: "age", width: 90},
        {displayName: "Gold", field: "gold", width: 100},
        {displayName: "Silver", field: "silver", width: 100},
        {displayName: "Bronze", field: "bronze", width: 100},
        {displayName: "Total", field: "total", width: 100},
        {displayName: "Country", field: "country", width: 120},
        {displayName: "Year", field: "year", width: 90},
        {displayName: "Date", field: "date", width: 110},
        {displayName: "Sport", field: "sport", width: 110}
    ];

    $scope.gridOptions = {
        columnDefs: columnDefs,
        rowData: [],
        groupUseEntireRow: true,
        groupKeys: ['country'],
        groupAggFunction: groupAggFunction,
        groupInnerCellRenderer: groupInnerCellRendererFunc
    };

    function groupInnerCellRendererFunc(data) {
        var flagCode = FLAG_CODES[data.key];

        var html = '';
        if (flagCode) {
            html += '<img class="flag" border="0" width="20" height="15" src="http://flags.fmcdn.net/data/flags/mini/'+flagCode+'.png">'
        }

        html += '<span class="groupTitle"> COUNTRY_NAME</span>'.replace('COUNTRY_NAME', data.key);
        html += '<span class="medal gold"> Gold: GOLD_COUNT</span>'.replace('GOLD_COUNT', data.aggData.gold);
        html += '<span class="medal silver"> Silver: SILVER_COUNT</span>'.replace('SILVER_COUNT', data.aggData.silver);
        html += '<span class="medal bronze"> Bronze: BRONZE_COUNT</span>'.replace('BRONZE_COUNT', data.aggData.bronze);

        return html;
    }

    function groupAggFunction(rows) {

        var sums = {
            gold: 0,
            silver: 0,
            bronze: 0,
            total: 0,
            minAge: 100,
            maxAge: 0,
        };

        rows.forEach(function(row) {

            var rowIsAGroup = row._angularGrid_group;

            // if this is a group, then we agg from the aggData,
            // not the row itself.
            var data;
            if (rowIsAGroup) {
                data = row.aggData;

                if (sums.minAge > data.minAge) {
                    sums.minAge = data.minAge;
                }
                if (sums.maxAge < data.maxAge) {
                    sums.maxAge = data.maxAge;
                }

            } else {

                data = row;

                if (sums.minAge > data.age) {
                    sums.minAge = data.age;
                }
                if (sums.maxAge < data.age) {
                    sums.maxAge = data.age;
                }

            }

            sums.gold += data.gold;
            sums.silver += data.silver;
            sums.bronze += data.bronze;
            sums.total += data.total;

        });

        return sums;
    }

    $http.get("../olympicWinners.json")
        .then(function(res){
            $scope.gridOptions.rowData = res.data;
            $scope.gridOptions.api.onNewRows();
        });
});
