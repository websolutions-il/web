export class User {
    UserName: string="";// tz
    DBuserName:string= '@user_name';

    Password: string="";// empty
    DBpassword: string= '@password';

    TZ: string="";
    DBtz:string= '@tz';

    FirstName: string="";
    DBfirstName: string= '@first_name';

    LastName: string="";
    DBlastName:string= '@last_name';

    CompanyId: string="0";
    DBcompenyId: string= '@company_id';

    Email: string="";
    DBemail:string= '@email';

    Phone: string="";
    DBphone: string= '@phone';

    Bill2mail: string="false";
    DBbill2mail:string= '@bill2mail';

    IsApprovedRegulation: string="true";
    DBIsApprovedRegulation: string= '@IsApprovedRegulation';

    identity_type: string = "";
    DBidentity_type ="@Identity_Type"

}