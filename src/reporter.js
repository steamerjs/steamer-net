class Reporter {
    injectReporter(reporter, cb) {
        this.reporter = reporter;
        this.cb = cb;
    }

    report() {
        this.cb(this.reporter);
    }
}

const reporter = new Reporter();
export default reporter;
