using System;

namespace VoyageVistaSales.Azure.Functions.BogusData;

public static class FlightDataEnums
{
    public enum FlightClass
    {
        Economy,
        Business,
        First
    }

    public enum Airlines
    {
        KLM,
        Transavia,
        RyanAir,
        EasyJet,
        Lufthansa,
        BritishAirways,
        AirFrance,
        Emirates,
        QatarAirways,
        SingaporeAirlines,
        Delta,
        United

    }
    public enum IataAirportCode
    {
        // North America
        ATL, // Hartsfield–Jackson Atlanta International
        LAX, // Los Angeles International
        ORD, // O'Hare International
        DFW, // Dallas/Fort Worth International
        DEN, // Denver International
        JFK, // John F. Kennedy International
        SFO, // San Francisco International
        SEA, // Seattle-Tacoma International
        MCO, // Orlando International
        YYZ, // Toronto Pearson International

        // Europe
        LHR, // London Heathrow
        CDG, // Charles de Gaulle (Paris)
        AMS, // Amsterdam Airport Schiphol
        FRA, // Frankfurt Airport
        IST, // Istanbul Airport
        MAD, // Adolfo Suárez Madrid–Barajas
        BCN, // Josep Tarradellas Barcelona–El Prat
        FCO, // Leonardo da Vinci–Fiumicino (Rome)
        MUC, // Munich Airport
        DME, // Domodedovo International (Moscow)

        // Asia & Middle East
        DXB, // Dubai International
        HND, // Tokyo Haneda
        NRT, // Tokyo Narita
        PEK, // Beijing Capital International
        PVG, // Shanghai Pudong International
        SIN, // Singapore Changi
        HKG, // Hong Kong International
        ICN, // Incheon International (Seoul)
        BKK, // Suvarnabhumi Airport (Bangkok)
        KUL, // Kuala Lumpur International
        DEL, // Indira Gandhi International (Delhi)
        BOM, // Chhatrapati Shivaji Maharaj International (Mumbai)

        // Oceania
        SYD, // Sydney Kingsford Smith
        MEL, // Melbourne Airport
        AKL, // Auckland International

        // Latin America & Africa
        GRU, // São Paulo/Guarulhos International
        MEX, // Mexico City International
        BOG, // El Dorado International (Bogotá)
        JNB, // O.R. Tambo International (Johannesburg)
        CAI  // Cairo International
    }
}
