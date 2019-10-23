// 👿 Few words from your product manager, we want to test the sensors component:
// When emitting a new event -> if category or temperature are not specified -> return 400
// When emitting a new event -> if temperature exceeds 50 degree -> send notification
// When emitting a new event -> if temperature exceeds 30 degree & sensor category is 'kids-room' -> send notification
// When trying to get 50 sensors -> our DB stands to the mission and return all of them

//💰 Few words from your CFO, we will reward you (Bonus!) if you will:
//1. Test that email is sent when the temp is too high. This logic is implemented within the file - sensors-queue-subscriber. It might a bit challenging
//because it's invoked using a message-queue (not API)

// 🧚‍ Few words from your architect: remember that this is a component test, we want to test EVERYTHING
//as long as it belongs to the sensors Microservice. Take a look at this lib - it might ease to shorten
//your assertions https://github.com/jest-community/jest-extended
test.todo('Test it 👆🏽');

const request = require("supertest");
const express = require("express");
const apiUnderTest = require("../sensors-api");
const nock = require("nock");

let expressApp, expressConnection;

beforeAll(() => {
    expressApp = express();
    expressConnection = expressApp.listen(); //no port specified
    apiUnderTest(expressApp);
});

afterAll(() => {
    expressConnection.close();
})

describe.only('Sensors test', () => {
    test('When category is not specified, should get http 400 error', async () => {
        const request = require("supertest");

        //Arrange
        const eventToAdd = {
            category: undefined,
            temperature: 20,
            manufacturer: "samsung",
            longtitude: 80,
            latitude: 120,
            name: 'Thermostat',
            color: 'Green',
            weight: "80 gram",
            status: "active"
        };

        const APIResponse = await request(expressApp)
            .post("/sensor-events")
            .send(eventToAdd);

        const {
            status
        } = APIResponse;

        expect({
            status
        }).toMatchObject({
            status: 400
        });
    });

    test('When temperature exceeds 50 degree, should send notification', async () => {
        const request = require("supertest");

        //Arrange
        const eventToAdd = {
            category: 'some-room',
            temperature: 55,
            manufacturer: "samsung",
            longtitude: 80,
            latitude: 120,
            name: 'Thermostat',
            color: 'Green',
            weight: "80 gram",
            status: "active"
        };

        const scope =nock("http://localhost")
            .get('/notification/')
            .reply(200, { data: "some data" });


        const APIResponse = await request(expressApp)
            .post("/sensor-events")
            .send(eventToAdd);

        expect(scope.isDone()).toBe(true);
    });
});

