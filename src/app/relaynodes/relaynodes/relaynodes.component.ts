import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../../providers/apiservice.service';
import { CRNS, CRN } from '../../interfaces/crn';
import { RelayNodes } from '../../interfaces/relayNodesServerList';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { MenuItem, LazyLoadEvent } from 'primeng/api';
import { CountriesRelayNodes } from '../countries';



@Component({
  selector: 'app-relaynodes',
  templateUrl: './relaynodes.component.html',
  animations: [
        trigger('rowExpansionTrigger', [
            state('void', style({
                transform: 'translateX(-10%)',
                opacity: 0
            })),
            state('active', style({
                transform: 'translateX(0)',
                opacity: 1
            })),
            transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ],
  styleUrls: ['./relaynodes.component.scss']
})
export class RelaynodesComponent implements OnInit {

  public relayNodesServerList: any;
  public relayNodesServerListTemp: any ;
  public cols: Array<{field, header, width}>;
  public cols2: Array<{field, header, width}>;
  public textSearch;
  public textSearchRounds;
  public totalRelaynodes: number;
  public crns: any;
  public crnsTemp: any;
  public selectedCRN: any;
  public subscription: Subscription;
  public displayDialogProprieties = false;
  public optionFilterStateRN;
  public OptionsNodes;
  public items: MenuItem[];
  public tabSelected = 'RelayNodes';
  public ledgerInfo: any;
  public ledgerInfoTemp: Array<any> = [];
  public totalLedgerInfo: number;
  public selectedHash: any;
  public displayDialogLedgerHash = false;
  public colsCrnInfo: any;
  public selectedAccount: any;
  public totalAccounts: any;
  public activeTab: MenuItem;
  public subscriptionCRN: Subscription;
  public nextCrnRound: number;
  public selectedAccountTemp: any;
  public textAccountID;
  public lastCheckRelayNodeChecks: Date;
  public nextCheckRelayNodeChecks: Date;
  public displaySigned = false;
  public colsCountriesSigned;
  public countriesSigned = [];
  public countriesRelayNodes = CountriesRelayNodes;
  public loading = false;
  public CRNTXHistory;

  constructor(
    private apiService: ApiserviceService
  ) {}

  ngOnInit() {
     // get Relaynodes From BRM-API from CSC
    this.apiService.getRelayNodesServerList().subscribe((data: Array<RelayNodes>) => {

      this.countriesRelayNodes.forEach((item: { name, value, crnMax }) => {
        this.countriesSigned.push({ country: item.name, total: 0 , crnAvailable: item.crnMax});
      });

      for (const relayNode of data) {
        this.countriesSigned.forEach((countrySigned: { country, total, crnAvailable }) => {
          if (relayNode.region === countrySigned.country) {
            countrySigned.total++;
            countrySigned.crnAvailable--;
          }
        });
      }
      // get all crn from CSC
      this.apiService.getAllCRN().subscribe((crns: CRNS) => {
        // console.log('getAllCRN', crns);
        if (crns) {
          // get info on Last ledger
          this.nextCrnRound = crns.crn_last_ledger + 1024;
          this.apiService.getLedger(crns.crn_last_ledger).subscribe((value: any) => {
            // console.log('value', value);
            const history = value.transactions.find(item => item.type === 'setCRNRound');
            if (history) {
              // console.log('element', history);
              const CRNTXHistory: string[] = history.specification.CRNTXHistory;
              CRNTXHistory.reverse();
              this.CRNTXHistory = CRNTXHistory;
              this.totalLedgerInfo = CRNTXHistory.length; 
              // console.log('CRNTXHistory', CRNTXHistory);
              // this.apiService.findTransactions(CRNTXHistory);
            }
          });
            // .catch((err) => console.log('Error getting info of Ledger', err));
          this.crns = crns;
          this.crnsTemp = this.crns.crns;
          this.relayNodesServerList = data.map((relayNode) => {
            const findCrn: CRN = this.crnsTemp.find((crn: CRN) =>  crn.crn_public_key === relayNode.publicKey );
            return { ...findCrn, ...relayNode };
          });
          // console.log(this.relayNodesServerList);
          this.relayNodesServerListTemp = this.relayNodesServerList;
          this.totalRelaynodes = this.relayNodesServerListTemp.length;
        }
      }, error => {
          const errorMessage = error;
          console.log(errorMessage);
      });
      // console.log(data);
    }, error => {
        const errorMessage = error;
        console.log(errorMessage);
    });

    // server info subscription
    this.subscription = this.apiService.getInfoWebSocketCRN().subscribe(data => {
      if (data) {
        this.selectedCRN = data;
        // console.log('server info subscription', this.selectedCRN);
      } else {
        this.selectedCRN = 'Error';
        console.log('Error in getInfoWebSocketCRN', data);
      }
    });

    // connect subject for transactions;
    this.apiService.getTransactions().subscribe((tx) => {
      if (tx) {
        this.ledgerInfoTemp.push(tx);
        // this.ledgerInfo = this.ledgerInfoTemp;
        this.ledgerInfoTemp.sort((a, b) => {
          return b.ledgerVersion - a.ledgerVersion;
        });
      }
    });

    this.cols = [
        { field: 'name', header: 'Name', width: '16%' },
        { field: 'crn_account_id', header: 'Account ID', width: '25%' },
        { field: 'publicKey', header: 'Public Key', width: '37%' },
        { field: 'status', header: 'Status', width: '15%' },
        { field: 'enabled', header: 'Enabled', width: '7%' },
    ];

    this.cols2 = [
      { field: 'ledgerVersion', header: 'Ledger Version', width: '15%' },
      { field: 'transactionHash', header: 'Transaction Hash', width: '45%' },
      { field: 'closeTime', header: 'Closed Time', width: '20%' },
      { field: 'FeesDistributed', header: 'Fees Distributed', width: '20%' },
    ];

    this.OptionsNodes = [
      { label: 'RelayNode Ok', value: 'Ok' },
      { label: 'RelayNode Fail', value: 'fail' }
    ];

    this.colsCrnInfo = [
      { field: 'publicKey', header: 'Account ID', width: '70%' },
      { field: 'value', header: 'Fees Distributed', width: '30%' },
    ];

    this.items = [
      {
        label: 'RelayNodes', icon: 'fas fa-cubes', command: (event) => {
          this.textSearch = null;
          this.relayNodesServerListTemp = this.relayNodesServerList;
          this.totalRelaynodes = this.relayNodesServerListTemp.length;
          this.tabSelected = event.item.label;
        }
      },
      {
        label: 'CRN Rounds', icon: 'fas fa-file-invoice', command: (event) => {
          this.tabSelected = event.item.label;
        }
      }
    ];

    this.colsCountriesSigned = [
      { field: 'country', header: 'Country' },
      { field: 'total', header: 'Total Signed' },
      { field: 'crnAvailable', header: 'CRN Available' },
    ];
    // active tab RelayNodes
    this.activeTab = this.items[0];

    this.apiService.getLastCheckRelayNodeChecks().subscribe((data: { status, date }) => {
      if (data.status === 'ok') {
        this.lastCheckRelayNodeChecks = data.date;
        const date: Date = new Date(data.date);
        this.nextCheckRelayNodeChecks = new Date(date.setHours(date.getHours() + 1));
      }
    },
      err => {
        console.log('HTTP Error', err.error.status);
      },
    );
    // getLastCheckRelayNodeChecks();
    // setInterval(() => { getLastCheckRelayNodeChecks(); }, 10000);
  }

  getCountriesSigned() {
    this.displaySigned = true;
  }

  search(event) {
    let value;
    value = event.target.value.toLowerCase();
    const temp = [];
    const values = ['name', 'serverName', 'publicKey', 'crn_account_id'];
    for (const relayNode of this.relayNodesServerList) {
      for (const key in relayNode) {
        if (relayNode[key] !== null && values.includes(key)) {
          if (relayNode[key].toString().toLowerCase().includes(value)) {
            temp.push(relayNode);
            break;
          }
        }
      }
    }
    this.relayNodesServerListTemp = temp;
    this.totalRelaynodes = this.relayNodesServerListTemp.length;
  }

  loadCarsLazy(event: LazyLoadEvent) {
    console.log(event);
    this.ledgerInfoTemp = [];
    const arr = this.CRNTXHistory.slice(event.first, (event.first + event.rows));
    this.apiService.findTransactions(arr);
  }

  searchRounds(event) {
    console.log(event);
    const value = event.toLowerCase();
    const arr = this.CRNTXHistory.filter( val => val.toString().toLowerCase() === value);
    console.log(arr);
    if (arr.length > 0) {
      if (this.ledgerInfoTemp.length === 25) { this.ledgerInfo = this.ledgerInfoTemp; }
      this.ledgerInfoTemp = [];
      this.apiService.findTransactions(arr);
    } else {
      console.log('error');
    }
    // const temp = [];
    // const values = ['ledgerVersion', 'transactionHash'];
    // for (const relayNode of this.ledgerInfo) {
    //   for (const key in relayNode) {
    //     if (relayNode[key] !== null && values.includes(key)) {
    //       if (relayNode[key].toString().toLowerCase().includes(value)) {
    //         temp.push(relayNode);
    //         break;
    //       }
    //     }
    //   }
    // }
    // this.ledgerInfoTemp = temp;
    // this.totalLedgerInfo = this.ledgerInfoTemp.length;
  }

  restoreTemp() {
    console.log('ledgerInfo', this.ledgerInfo);
    this.textSearchRounds = null;
    this.ledgerInfoTemp = this.ledgerInfo;

  }

  onRowSelect(crn: any) {
    this.textSearch = null;
    this.selectedCRN = null;
    if (crn.status === 'Can not connect to the nodes WebSocket endpoint.' ) {
      this.selectedCRN = 'Error';
      console.log('Dismissed Connection');
    } else {
      this.apiService.WebSocketCRN(crn.webSocket, crn.crn_account_id);
    }
  }

  searchPublicKey(publicKey) {
    this.activeTab = this.items[0];
    this.tabSelected = 'RelayNodes';
    this.textSearch = publicKey;
    this.displayDialogLedgerHash = false;
    this.selectedAccount = null;
    this.textSearchRounds = null;
    // this.selectedAccountTemp.crns = this.selectedAccount.crns;
    const temp = [];
    const value = publicKey.toLowerCase();
    const values = ['crn_account_id'];
    for (const relayNode of this.relayNodesServerList) {
      for (const key in relayNode) {
        if (relayNode[key] !== null && values.includes(key)) {
          if (relayNode[key].toString().toLowerCase().includes(value)) {
            temp.push(relayNode);
            break;
          }
        }
      }
    }
    this.relayNodesServerListTemp = temp;
    this.totalRelaynodes = this.relayNodesServerListTemp.length;
  }

  onRowSelectLedgerHash(selectedHash: any) {
    const arr = [];
    // tslint:disable-next-line:forin
    for (const prop in selectedHash.crns) {
      arr.push({ publicKey: prop, ...selectedHash.crns[prop][0] });
    }
    this.selectedAccount = {
      crns: arr,
      ledgerVersion: selectedHash.ledgerVersion,
      transactionHash: selectedHash.transactionHash,
      closeTime: selectedHash.closeTime,
      FeesDistributed: selectedHash.FeesDistributed
    };
    this.selectedAccountTemp = { ...this.selectedAccount };
    this.totalAccounts = this.selectedAccount.crns.length;
    this.displayDialogLedgerHash = true;
    console.log(this.selectedAccount);
  }

  showDialog() {
    this.displayDialogProprieties = true;
  }

  filterStateRn(val) {
    if (!val) {
      this.relayNodesServerListTemp = this.relayNodesServerList;
      this.totalRelaynodes = this.relayNodesServerListTemp.length;
    } else if (val === 'Ok') {
      this.relayNodesServerListTemp = this.relayNodesServerList.filter(item => item.status === val);
      this.totalRelaynodes = this.relayNodesServerListTemp.length;
    } else {
      this.relayNodesServerListTemp = this.relayNodesServerList.filter(item => item.status !== 'Ok');
      this.totalRelaynodes = this.relayNodesServerListTemp.length;
    }
  }

  filterAccountId(text) {
    const value = text.toLowerCase();
    const temp = [];
    const values = ['publicKey'];
    for (const account of this.selectedAccount.crns) {
      for (const key in account) {
        if (account[key] !== null && values.includes(key)) {
          console.log(account[key]);
          if (account[key].toString().toLowerCase().includes(value)) {
            temp.push(account);
            break;
          }
        }
      }
    }
    console.log(temp);
    this.selectedAccountTemp.crns = temp;
    this.totalAccounts = this.selectedAccountTemp.crns.length;
  }

  ConvertFees(fees: number) {
    if (fees) {
      function splitValue(value, index) {
          return value.substring(0, index) + '.' + value.substring(index);
      }
      const num = fees.toString();
      const fee = splitValue(num, (num.length - 8));
      const feesConvert = fee.replace(/\B(?=(?=\d*\.)(\d{3})+(?!\d))/g, ',');
      return feesConvert;
    } else {
      return null;
    }
  }

}
