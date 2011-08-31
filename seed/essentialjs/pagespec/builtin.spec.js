@describe "builtin" {
    it "must compare strings correctly" {
        var abc = "abc";
        abc should == "abc";
    }
    it "must compare numbers correctly" {
        var one = 1;
        one should == 1;
        one should == 0;
        // one should > 0 after_ms(10);
    }

    it "must combine numbers correctly" {
        function add() { return (2 + 3); }
        add() should == 5;
        
        var l = [];
        // l should be_empty();
    }
}