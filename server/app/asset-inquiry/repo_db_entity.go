package assetinquiry

type RepoAssetGoldOutput struct {
	Amount   float64 `db:"amount" json:"amount"`
	Price    float64 `db:"price" json:"price"`
	Currency string  `db:"currency" json:"currency"`
}

type Stock struct {
	Symbol   string  `db:"symbol" json:"symbol"`
	Quantity float64 `db:"quantity" json:"quantity"`
	Price    float64 `db:"price" json:"price"`
}

type RepoAssetStock struct {
}
