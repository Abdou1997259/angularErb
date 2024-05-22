export interface Journal
{
    n_doc_no:number;
    d_doc_date:string;
    n_currency_id:number;
    n_journal_id:number;
    s_arabic_description:string;
    s_english_description:string;
    n_doc_trans_no: number;
    s_book_doc_no:string;
    n_document_no: number;
    journalDetails: Array<JournalDetails> 
}

export interface JournalDetails
{
    n_doc_serial:number;
    s_account_no:string;
    n_debit:number;
    n_credit:number;
    s_cost_center:string;
    s_detailed_arabic_description:string;
    n_account_allocat:number;
}