package assetmaintenance

import (
	"context"
	"errors"
	"myport/database"
)

type RepoDb interface {
	InsertStock(ctx context.Context, input RepoInsertStockInput) (*RepoInsertStockOutput, error)
}

func NewRepoDb(db database.PgxIface) RepoDb {
	return &repoDb{
		db: db,
	}
}

type repoDb struct {
	db database.PgxIface
}

func (r *repoDb) InsertStock(ctx context.Context, input RepoInsertStockInput) (*RepoInsertStockOutput, error) {
	stmt := `INSERT INTO stock_books
		(side, symbol, title, industry, sub_industry, market, amount, price, currency, created_by, updated_by)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		RETURNING id	;`

	var id int64
	cmd, err := r.db.Exec(ctx, stmt,
		input.Side,
		input.Symbol,
		input.title,
		input.industry,
		input.sub_industry,
		input.market,
		input.amount,
		input.price,
		input.currency,
		input.created_by,
		input.updated_by,
		&id,
	)
	if err != nil {
		return nil, err
	}

	if cmd.RowsAffected() > 0 {
		return nil, errors.New("no rows affected")
	}

	return &RepoInsertStockOutput{ID: id}, nil
}
