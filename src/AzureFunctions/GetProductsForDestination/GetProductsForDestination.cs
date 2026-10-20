using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using VoyageVistaSales.Azure.Functions.Generators;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.OpenApi.Models;
using System.Net;
using VoyageVistaSales.Azure.Functions.Models;


namespace VoyageVistaSales.Azure.Functions;

public class GetProductsForDestination
{
    private readonly ILogger<GetProductsForDestination> _logger;
    
    public GetProductsForDestination(ILogger<GetProductsForDestination> logger)
    {
        _logger = logger;
    }

    [OpenApiOperation(operationId: "GetFlightsForDestination", tags: new[] { "Flights" }, Summary = "Get flights for a specific destination", Description = "Returns a list of flights for the specified destination.")]
    [OpenApiParameter(name: "destination", In = ParameterLocation.Query, Required = true,
        Type = typeof(string), Summary = "Destination", Description = "e.g. Berlin")]
    [OpenApiResponseWithBody(HttpStatusCode.OK, "application/json", typeof(List<FlightModel>),
        Summary = "List of flights")]
    [OpenApiResponseWithoutBody(HttpStatusCode.BadRequest, Summary = "Missing destination")]
    [Function("GetFlightsForDestination")]
    public IActionResult GetFlightsForDestination([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest req)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request.");
        var destination = req.Query["destination"].ToString();
        if (string.IsNullOrEmpty(destination))
        {
            return new BadRequestObjectResult("Please provide a destination in the query string.");
        }

        _logger.LogInformation($"Generating flights for destination: {destination}");
        var flights = new FlightGenerator(destination).Generate(10);

        return new OkObjectResult(flights);
    }

    [OpenApiOperation(operationId: "GetStaysForDestination", tags: new[] { "Stays" }, Summary = "Get stays for a specific destination", Description = "Returns a list of stays for the specified destination.")]
    [OpenApiParameter(name: "destination", In = ParameterLocation.Query, Required = true
        , Type = typeof(string), Summary = "Destination", Description = "e.g. Berlin")]
    [OpenApiResponseWithBody(HttpStatusCode.OK, "application/json", typeof(List<StayModel>),
        Summary = "List of stays")]
    [OpenApiResponseWithoutBody(HttpStatusCode.BadRequest, Summary = "Missing destination")]
    [Function("GetStaysForDestination")]
    public IActionResult GetStaysForDestination([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest req)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request.");
        var destination = req.Query["destination"].ToString();
        if (string.IsNullOrEmpty(destination))
        {
            return new BadRequestObjectResult("Please provide a destination in the query string.");
        }

        _logger.LogInformation($"Generating stays for destination: {destination}");
        var stays = new StayGenerator(destination).Generate(10);

        return new OkObjectResult(stays);
    }

    [OpenApiOperation(operationId: "GetExcursionsForDestination", tags: new[] { "Excursions" }, Summary = "Get excursions for a specific destination", Description = "Returns a list of excursions for the specified destination.")]
    [OpenApiParameter(name: "destination", In = ParameterLocation.Query, Required = true
        , Type = typeof(string), Summary = "Destination", Description = "e.g. Berlin")]
    [OpenApiResponseWithBody(HttpStatusCode.OK, "application/json", typeof(List<ExcursionModel>),
        Summary = "List of excursions")]
    [OpenApiResponseWithoutBody(HttpStatusCode.BadRequest, Summary = "Missing destination")]
    [Function("GetExcursionsForDestination")]
    public IActionResult GetExcursionsForDestination([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest req)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request.");
        var destination = req.Query["destination"].ToString();
        if (string.IsNullOrEmpty(destination))
        {
            return new BadRequestObjectResult("Please provide a destination in the query string.");
        }

        _logger.LogInformation($"Generating excursions for destination: {destination}");
        var excursions = new ExcursionGenerator(destination).Generate(10);

        return new OkObjectResult(excursions);
    }
}