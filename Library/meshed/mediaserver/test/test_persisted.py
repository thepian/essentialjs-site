from mediaserver import *
from mediaserver import persisted


def test_load():
    connect_redis(db=5)
    flushdb()
    load_scopes()
    load_seed()
    assert persisted.REDIS is not None

def test_results():
    account = "essentialjs"
    project = "pagespec"
    
    persisted.persist_results([
        {
        #outcome: ended, skipped, exception, failed
        "outcome": "exception",
        "result": "ReferenceError: info is undefined",
        "spec": "builtin", #  spec: name of the spec context
        "example": "must compare strings correctly", # example: name of the example
        },
        {
        "outcome": "exception",
        "result": "ReferenceError: info is undefined",
        "spec": "builtin", #  spec: name of the spec context
        "example": "must compare numbers correctly", # example: name of the example
        },
        {
        #outcome: ended, skipped, exception, failed
        "outcome": "exception",
        "result": "ReferenceError: info is undefined",
        "spec": "builtin", #  spec: name of the spec context
        "example": "must combine numbers correctly", # example: name of the example
        },
        {
        "outcome": "ended",
        "spec": "builtin", 
        },
    ],
    account=account,project=project,run="1001")
    
    ongoing_builtin_key = persisted.ONGOING_RUNS_KEY % (account,project,"builtin")
    print persisted.REDIS.smembers(persisted.ONGOING_RUNS_KEY % (account,project,"builtin2"))
    assert persisted.REDIS.sismember(ongoing_builtin_key,"1001")
    ongoing = persisted.REDIS.smembers(ongoing_builtin_key,"builtin")
    assert "1001" in ongoing