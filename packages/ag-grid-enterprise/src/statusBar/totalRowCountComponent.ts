import {Autowired, Events, EventService, GridApi, PostConstruct} from 'ag-grid';
import {StatusBarValueComponent} from "./statusBarValueComponent";

export class TotalRowCountComponent  extends StatusBarValueComponent {

    @Autowired('eventService') private eventService: EventService;
    @Autowired('gridApi') private gridApi: GridApi;

    constructor() {
        super('rowCount', 'Total Rows');
    }

    @PostConstruct
    protected postConstruct(): void {
        super.postConstruct();

        // this component is only really useful with client side rowmodel
        if (this.gridApi.getModel().getType() !== 'clientSide') {
            console.warn(`ag-Grid: agTotalAndFilteredRowCountComponent should only be used with the client side row model.`);
            return;
        }

        this.addCssClass('ag-status-bar-total-row-count');

        this.setVisible(true);

        const listener = this.onDataChanged.bind(this);
        this.eventService.addEventListener(Events.EVENT_MODEL_UPDATED, listener);
    }

    private onDataChanged() {
        this.setValue(this.getRowCountValue())
    }

    private getRowCountValue(): string {
        let totalRowCount = 0;
        this.gridApi.forEachNode((node) => totalRowCount += 1);

        return `${totalRowCount}`;
    }

    public init() {
    }
}
