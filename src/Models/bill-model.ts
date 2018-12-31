export class billModel{
  constructor(CreateDate, stub_code, total_price, status, img_link, pdf_link)
  {
    this.CreateDate = new Date(CreateDate);
    this.stub_code = stub_code;
    this.total_price = total_price;
    this.status = status;
    this.img_link = img_link;
    this.pdf_link = pdf_link;
  }

    public CreateDate: Date;
    public stub_code: string;
    public total_price: string;
    public status:string="";
    public img_link: string;
    public pdf_link:string;
  }
  