import { action, observable } from 'mobx'

class Store {
  @observable isServer = false
  @observable clientInitTime = 0
  @observable isAuth = false
  @observable name = "name-default"
  @observable age = 0
  @observable list = []

  @action init = (isServer, name, age) => {
    console.log("new Store with: ", arguments)
    this.isServer = isServer
    if (!isServer) {
      this.clientInitTime = Date.now()
    }
    this.name = name
    this.age = age
  }

  @action setAuth = () => {
    this.isAuth = true
  }

  @action unsetAuth = () => {
    this.isAuth = false
  }

  @action loadMoreList = (more) => {
    this.list = this.list.concat(more)
  }

  @action delayAdd = (num) => {
    setTimeout(() => {
      this.age += num
    }, 3000)
  }
}

const store = new Store()

export default store