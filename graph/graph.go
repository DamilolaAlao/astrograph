package graph

import (
	"log"
	"sync"
	"context"
)

type App struct {
	AccountChannels map[string]chan Account
	AccountCounters map[string]uint64
	mu       		    sync.Mutex
}

func (a *App) Query_Account(ctx context.Context, id *string) (*Account, error) {
	return nil, nil
}

func (a *App)	Query_Accounts(ctx context.Context, limit *int, skip *int, order *string) ([]Account, error) {
  return nil, nil
}

func (a *App) Account_trustlines(ctx context.Context, obj *Account) ([]Trustline, error) {
  return nil, nil
}

func (a *App) Subscription_accountUpdated(ctx context.Context, id string) (<-chan Account, error) {
	a.mu.Lock()
	ch := a.AccountChannels[id]
	log.Println("Searching for subscription", id, "...")
	if ch == nil {
		log.Println("Creating subscription on", id, "...")
		ch = make(chan Account, 1)
		a.AccountCounters[id] = 1
		a.AccountChannels[id] = ch
	} else {
		a.AccountCounters[id]++
	}
	a.mu.Unlock()

	go func() {
		<-ctx.Done()
		log.Println(id, "unsubscribed")
		a.mu.Lock()
		a.AccountCounters[id]--
		log.Println("Counter for", id, "is", a.AccountCounters[id])
		if (a.AccountCounters[id] <= 0) {
			delete(a.AccountChannels, id)
		}
		a.mu.Unlock()
	}()

	return ch, nil
}

func (a *App) SendAccountUpdates(accounts []Account) {
  a.mu.Lock()
  for _, account := range accounts {
		ch := a.AccountChannels[account.ID]
		if (ch == nil) {
			continue
		}

		ch <- account
  }
	a.mu.Unlock()
}
