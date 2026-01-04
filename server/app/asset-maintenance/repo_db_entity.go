package assetmaintenance

type RepoInsertStockInput struct {
	Side         string
	Symbol       string
	title        string
	industry     string
	sub_industry string
	market       string
	amount       float32
	price        float32
	currency     string
	created_by   string
	updated_by   string
}

type RepoInsertStockOutput struct {
	ID int64
}
