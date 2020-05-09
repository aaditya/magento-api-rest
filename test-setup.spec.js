"use strict";

import moxios from 'moxios';

beforeEach(function() {
    moxios.install();
});

afterEach(function () {
    moxios.uninstall();
});