import test from 'ava';

import { OmnibugProvider, AdobeTargetProvider } from "./../providers.js";

test("AdobeTargetProvider returns provider information", t => {
    let provider = new AdobeTargetProvider();
    t.is(provider.key, "ADOBETARGET", "Key should always be ADOBETARGET");
    t.is(provider.type, "UX Testing", "Type should always be UX Testing");
    t.is(provider.name, "Adobe Target", "Name should be returned as Adobe Target");
    t.true(typeof provider.pattern === 'object' && provider.pattern instanceof RegExp, "Pattern should be a RegExp value");
});

test("AdobeTargetProvider pattern should match Adobe Target domains", t => {
    let provider = new AdobeTargetProvider(),
        urls = [
            "http://omnibug.tt.omtrdc.net/m2/omnibug/mbox/standard",
            "https://omnibug.tt.omtrdc.net/m2/omnibug/mbox/standard",
            "http://omnibug.tt.omtrdc.net/m2/omnibug/mbox/json",
            "https://omnibug.tt.omtrdc.net/m2/omnibug/mbox/json"
        ];

    urls.forEach((url) => {
        t.true(provider.checkUrl(url));
    });

    t.false(provider.checkUrl("https://omnibug.io/testing"), "Provider should not match on non-provider based URLs");
});

test("OmnibugProvider returns AdobeAnalytics", t => {
    let url = "http://omnibug.tt.omtrdc.net/m2/omnibug/mbox/standard?mboxHost=omnibug.io&mbox=foobar";

    let results = OmnibugProvider.parseUrl(url);
    t.is(results.provider.key, "ADOBETARGET", "Results provider should be Adobe Target");
});

test("AdobeTargetProvider returns static data", t => {
    let provider = new AdobeTargetProvider(),
        url = "http://omnibug.tt.omtrdc.net/m2/omnibug/mbox/standard?mboxHost=omnibug.io&mbox=foobar";

    let results = provider.parseUrl(url);

    t.is(typeof results.provider, "object", "Results should have provider information");
    t.is(results.provider.key, "ADOBETARGET", "Results provider is Adobe Target");
    t.is(typeof results.data, "object", "Results should have data");
    t.true(results.data.length > 0, "Data should be returned");
});

test("AdobeTargetProvider returns static data", t => {
    let provider = new AdobeTargetProvider(),
        url = "http://omnibug.tt.omtrdc.net/m2/omnibug/mbox/standard?mboxHost=omnibug.io&mbox=foobar";

    let results = provider.parseUrl(url);

    t.is(typeof results.provider, "object", "Results should have provider information");
    t.is(results.provider.key, "ADOBETARGET", "Results provider is Adobe Target");
    t.is(typeof results.data, "object", "Results should have data");

    let mboxHost = results.data.find((result) => {
        return result.key === "mboxHost";
    });
    t.is(mboxHost.field, "Page Host", "Page Host should be returned");
    t.is(mboxHost.value, "omnibug.io", "Page Host should be omnibug.io");
});

test("AdobeTargetProvider returns custom data", t => {
    let provider = new AdobeTargetProvider(),
        url = "http://omnibug.tt.omtrdc.net/m2/omnibug/mbox/standard?mboxHost=omnibug.io&mbox=foobar";

    let results = provider.parseUrl(url),
        mboxType = results.data.find((result) => {
            return result.key === "mboxType";
        }),
        clientCode = results.data.find((result) => {
            return result.key === "clientCode";
        });
    t.is(mboxType.field, "Mbox Type", "Mbox type should be returned");
    t.is(mboxType.value, "standard", "Mbox type should be standard");
    t.is(clientCode.field, "Client Code", "Client code should be returned");
    t.is(clientCode.value, "omnibug", "Client code should be clientCode");
});