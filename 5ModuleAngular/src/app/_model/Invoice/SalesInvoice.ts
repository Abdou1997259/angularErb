export interface SalesInvoice
{
    n_doc_no:number;
    d_doc_date:string ;
    n_customer_id:number;
    n_store_id:number;
    s_notes:string;
    InvoiceDetails: Array<SalesInvoiceDetails> 
}

export interface SalesInvoiceDetails
{
    n_doc_no:number;
    n_line_no:number;
    n_item_id:number;
    n_unit_price:number;
    n_qty:number;
    n_total_value:number;
    n_item_discount:number;
    n_net_value_without_tax:number;
    n_item_sales_tax:number;
    n_net_value:number; 
}