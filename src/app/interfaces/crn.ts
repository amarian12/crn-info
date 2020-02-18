export interface CRNS {
    crn_fee_distributed?: string;
    crn_fee_txs: Array<string>;
    crn_last_ledger: number;
    crn_rounds: boolean;
    crns: CRN;
    hash: string;
    seq: number;
    total_coins: string;
}

export interface CRN {
    crn_account_id: string;
    crn_fee_distributed: string;
    crn_public_key: string;
}
