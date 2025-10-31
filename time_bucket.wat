(module
  (func (export "bucket") (param $diff i32) (result i32)
    (if (result i32) (i32.lt_s (local.get $diff) (i32.const 60))
      (then (i32.const 0))
      (else
        (if (result i32) (i32.lt_s (local.get $diff) (i32.const 3600))
          (then (i32.const 1))
          (else
            (if (result i32) (i32.lt_s (local.get $diff) (i32.const 86400))
              (then (i32.const 2))
              (else
                (if (result i32) (i32.lt_s (local.get $diff) (i32.const 604800))
                  (then (i32.const 3))
                  (else (i32.const 4))
                )
              )
            )
          )
        )
      )
    )
  )
)
