var helpers = require('./helpers'),
    should  = require('should'),
    sinon   = require('sinon'),
    utils  = require('./../lib/utils');

describe('utils.should_proxy_to()', function() {

  var should_proxy_to  = utils.should_proxy_to;

  var noProxy          = ".ic1.mycorp,localhost,127.0.0.1,*.mycorp.org";
  var noProxyWithPorts = " ,.mycorp.org:1234,.ic1.mycorp,localhost,127.0.0.1";

  var uris = {
    hostname:          "http://registry.random.opr.mycorp.org",
    with_port:         "http://registry.random.opr.mycorp.org:9874",
    with_another_port: "http://registry.random.opr.mycorp.org:1234",
    localhost:         "http://localhost",
    ip:                "http://127.0.0.1"
  }

  it("returns true if NO_PROXY is undefined", function(done) {
    process.env.NO_PROXY = undefined;
    should_proxy_to(uris.hostname).should.true()
    delete process.env.NO_PROXY;
    done();
  });

  it("returns true if NO_PROXY is empty", function(done) {
    process.env.NO_PROXY = "";
    should_proxy_to(uris.hostname).should.true()
    delete process.env.NO_PROXY;
    done();
  });

  it("returns false if NO_PROXY is a wildcard", function(done) {
    process.env.NO_PROXY = "*";
    should_proxy_to(uris.hostname).should.false()
    delete process.env.NO_PROXY;
    done();
  });

  it("returns true if the host matches and the ports don't (URI doesn't have port specified)", function(done) {
    process.env.NO_PROXY = noProxyWithPorts;
    should_proxy_to(uris.hostname).should.true()
    delete process.env.NO_PROXY;
    done();
  });

  it("returns true if the host matches and the ports don't (both have a port specified but just different values)", function(done) {
    process.env.NO_PROXY = noProxyWithPorts;
    should_proxy_to(uris.with_port).should.true()
    delete process.env.NO_PROXY;
    done();
  });

  it("returns false if the host matches and the ports don't (no_proxy pattern doesn't have a port)", function(done) {
    process.env.NO_PROXY = noProxy;
    should_proxy_to(uris.with_port).should.false()
    delete process.env.NO_PROXY;
    done();
  });

  it("returns false if host matches", function(done) {
    process.env.NO_PROXY = noProxy;
    should_proxy_to(uris.hostname).should.false()
    delete process.env.NO_PROXY;
    done();
  });

  it("returns false if the host and port matches", function(done) {
    process.env.NO_PROXY = noProxyWithPorts;
    should_proxy_to(uris.with_another_port).should.false()
    delete process.env.NO_PROXY;
    done();
  });

  it("returns false if the host matches (localhost)", function(done) {
    process.env.NO_PROXY = noProxy;
    should_proxy_to(uris.localhost).should.false()
    delete process.env.NO_PROXY;
    done();
  });

  it("returns false if the host matches (ip)", function(done) {
    process.env.NO_PROXY = noProxy;
    should_proxy_to(uris.ip).should.false()
    delete process.env.NO_PROXY;
    done();
  });

  it("returns false if the host matches (ip)", function(done) {
    process.env.NO_PROXY = noProxy.replace(/,g/, " ");
    should_proxy_to(uris.ip).should.false()
    delete process.env.NO_PROXY;
    done();
  });

  it("returns false if the host matches (ip)", function(done) {
    process.env.NO_PROXY = noProxy.replace(/,g/, " ");
    should_proxy_to(uris.ip).should.false()
    delete process.env.NO_PROXY;
    done();
  });

})
