abstract class Base<P, Child extends Base<any, any>> {
  abstract selectState(): ReturnType<Child['selectState']>
  state: ReturnType<Child['selectState']>

  constructor(public props: P) {
    this.state = this.selectState()
  }
}

interface MyProps {
  a: string
  b: number
}

class MyScratch extends Base<MyProps, MyScratch> {
  selectState() {
    return {a: this.props.a}
  }

  doSomething() {
    const {a} = this.selectState()
  }
}
