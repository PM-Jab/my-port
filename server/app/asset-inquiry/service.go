package assetinquiry

import "context"

type Service interface {
	InquiryAssetGold(ctx context.Context) (float64, error)
}

type service struct {
}

func NewService() Service {
	return &service{}
}

func (s *service) InquiryAssetGold(ctx context.Context) (float64, error) {
	// Implementation for inquiring gold price goes here
	return 0, nil
}
