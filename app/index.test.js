import 'babel-polyfill';
import chai from "chai";
import Gear from "./index";
import Stream from "./stream";
const expect = chai.expect;

describe("Gear", function() {

    class Test{
        constructor(obj){
            Object.assign(this,obj);
        }

        originalFunc(){
            return true;
        };
    }

    const baseObj = new Test({
        a: 1,
        b: 2,
        c: { ca: 1, cb: 2},
        d: [1, 2, 3]
    });

    const gear1 = Gear(baseObj);

    it("값을 조회할 수 있다.", function() {
        expect(gear1.a).to.equal(1);
        expect(gear1.b).to.equal(2);
        expect(gear1.c.ca).to.equal(1);
        expect(gear1.c.cb).to.equal(2);
        expect(gear1.d).to.be.members([1,2,3]);
    });

    it("값을 추가, 변경할 수 있다.", function() {
        gear1.a = 2;
        gear1.b = 3;
        gear1.d = gear1.c;
        gear1.c = 4;
        gear1.e = 5;

        expect(gear1.a).to.equal(2);
        expect(gear1.b).to.equal(3);
        expect(gear1.c).to.equal(4);
        expect(gear1.d.ca).to.equal(1);
        expect(gear1.d.cb).to.equal(2);
        expect(gear1.e).to.equal(5);
    });

    it("원본객체를 참조하지 않는다.", function() {
        expect(baseObj.a).to.equal(1);
        expect(baseObj.b).to.equal(2);
        expect(baseObj.c.ca).to.equal(1);
        expect(baseObj.c.cb).to.equal(2);
        expect(baseObj.d).to.be.members([1,2,3]);
    });

    it("원본 prototype chain과 원래 기능을 유지한다.", function() {
        expect(gear1).to.be.an.instanceOf(Test);
        expect(gear1.originalFunc()).to.equal(true);
    });

    it("원본객체와는 다른 객체이다", function() {
        expect(gear1).to.not.equal(baseObj);
    });

    describe("#stream", function(){
        const gear2 = Gear({a:1});
        const stream1 = gear2.stream();
        const stream2 = gear2.stream();

        it("returns new instance for each call", function(){
            expect(stream1).to.be.instanceOf(Stream);
            expect(stream2).to.be.instanceOf(Stream);
            expect(stream1).not.to.be.equal(stream2);
        });

        it("new value is enqueued into instance whenever Gear's state is updated", function(){
            const result = [];
            gear2.stream().forEach(value => result.push(value));
            gear2.b = 2;
            gear2.a = 3;
            gear2.c = 10;
            expect(result).to.deep.equal([
                {a:1},
                {a:1,b:2},
                {a:3,b:2},
                {a:3,b:2,c:10}
            ]);
        });
    })
});
