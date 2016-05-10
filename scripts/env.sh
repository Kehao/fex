#!/bin/bash
checkWhich() {
    local X=0
    for CMD in "$@"; do
        which "$CMD" >/dev/null || { X=$?; echo >&2 "===> Command $CMD missing";  }
    done

    return $X
}

checkEnvironment() {
    local X=0
    checkWhich gulp || return $? 
    return $X
}

checkEnvironment
