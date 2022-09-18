const {request,expect,assert} = require("../../config");
const {ADMIN_TEST0,ADMIN_TEST1,ADMIN_TEST2} = require("../../data/Admin_");
const { RESPONSE_MESSAGES } = require("../../Helpers/ResponseMessages");

describe("AdminController unit tests", () => {
describe("LoginAdmin", () => {
    it("should log in the Admin", async() => {
     let response =  await request.post("/admin/log-in-admin").send({email:ADMIN_TEST2.email,password:ADMIN_TEST2.password});
     expect(response.status).to.equal(200);
     expect(response.body.ok).to.equal(true);
     expect(response.body.email).to.equal(ADMIN_TEST2.email);
    });
    it("shouldn't log in the Admin - incorrect password",async() => {
        let response =   await request.post("/admin/log-in-admin").send({email:ADMIN_TEST2.email,password:ADMIN_TEST0.password});
        expect(response.status).to.equal(400);
        expect(response.body.msg).to.equal(RESPONSE_MESSAGES.ERR_INVALID_PASSWORD);
    
    });
    it("shouldn't log in the Admin - incorrect email",async() => {
        let response =   await request.post("/admin/log-in-admin").send({email:ADMIN_TEST0.email, password:ADMIN_TEST0.password});
        expect(response.status).to.equal(400);
        expect(response.body.msg).to.equal(RESPONSE_MESSAGES.ERR_EMAIL_NOT_FOUND);
    });
});
});
