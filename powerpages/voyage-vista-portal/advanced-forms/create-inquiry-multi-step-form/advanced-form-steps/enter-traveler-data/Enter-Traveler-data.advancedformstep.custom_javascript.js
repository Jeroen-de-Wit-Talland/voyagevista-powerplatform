$(document).ready(function () {
    var subgrid = $("#sg_inquirytravelers"); 

    subgrid.on("loaded", function () {
        // Count the number of rows in the table body
        var rowCount = subgrid.find("table tbody tr").length;

        // If the subgrid displays an "Empty" row when there are no records, handle it
        if (rowCount === 1 && subgrid.find("table tbody tr td.empty").length > 0) {
            rowCount = 0;
        }

        console.log("Total records in visible page: " + rowCount);
        
        var numberOfTravelers = $("#voy_numberoftravelers").val();
        console.log("Number of travelers: " + numberOfTravelers);

        $("#voy_numberoftravelers").val(rowCount);
    });
});