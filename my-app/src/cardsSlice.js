store.dispatch(fetchCardsAndPermissions());

if (store.getState().cards.length === 0) {
  store.dispatch({
    type: 'cards/handleError',
    payload: {
      message: '没有找到卡片',
    },
  });
}
