@describe "Example" {
	if "should construct without exceptions" {
		ex = new Example();
		ex.value should == "";
	}
}