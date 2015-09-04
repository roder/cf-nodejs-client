/*jslint node: true*/
/*global describe: true, it: true*/
"use strict";

var chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    expect = require("chai").expect;
chai.use(chaiAsPromised);

var nconf = require('nconf');
nconf.argv().env().file({ file: 'config.json' });

var endPoint = nconf.get('CF_API_URL'),
    username = nconf.get('username'),
    password = nconf.get('password');

var CloudFoundry = require("../../../lib/model/CloudFoundry");
CloudFoundry = new CloudFoundry();

describe("Cloud Foundry", function () {

    it("The connection with the PaaS is OK", function () {

        CloudFoundry.setEndPoint(endPoint);

        return expect(CloudFoundry.getInfo()).eventually.property("name", "vcap");
    });

    it("The authentication with the PaaS is OK", function () {
        this.timeout(2500);

        CloudFoundry.setEndPoint(endPoint);

        var token_endpoint = null;
        return CloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password);
        }).then(function (result) {
            expect(result.token_type).to.equal("bearer");
        });
    });

    it("Use the constructor without the EndPoint", function () {
        this.timeout(2500);

        CloudFoundry.setEndPoint(endPoint);

        var token_endpoint = null;
        return CloudFoundry.getInfo().then(function (result) {
            token_endpoint = result.token_endpoint;
            return CloudFoundry.login(token_endpoint, username, password);
        }).then(function (result) {
            expect(result.token_type).to.equal("bearer");
        });
    });

});