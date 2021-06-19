/* eslint-disable promise/param-names */
const db = require('./db')

module.exports = {
  addItem: (table, data) => {
    return new Promise((resolve, rejected) => {
      db.query('INSERT INTO ?? SET ?', [table, data], (err, results, field) => {
        if (!err) {
          resolve(results)
        } else {
          rejected(err)
        }
      })
    })
  },
  getItem: (table, key, query) => {
    // cek apakah ada query
    // console.log(key)
    if (key) {
      return new Promise((resolve, rejected) => {
        db.query('SELECT * FROM ?? WHERE ?? LIKE ?', [table, key, `%${query}%`], (err, results, field) => {
          if (!err) {
            resolve(results)
          } else {
            rejected(err)
          }
        })
      })
    } else {
      return new Promise((resolve, rejected) => {
        db.query('SELECT * FROM ??', [table], (err, results, field) => {
          if (!err) {
            resolve(results)
          } else {
            rejected(err)
          }
        })
      })
    }
  },
  getItemAnd: (table, param1, param2) => {
    return new Promise((resolve, rejected) => {
      console.log(param1, param2)
      db.query('SELECT * FROM ?? WHERE ? AND ?', [table, param1, param2], (err, results, field) => {
        if (!err) {
          resolve(results)
        } else {
          rejected(err)
        }
      })
    })
  },
  getItemJoin: (table, key, query) => {
    // if (key) {
    //   return new Promise((resolve, rejected) => {
    //     db.query()
    //   })
    // } else {
    return new Promise((resolve, rejected) => {
      db.query('SELECT items.id, items.name, categories.name AS category, variants.name AS variant, sizes.size, items.description, items.price, images.image FROM ((((items LEFT JOIN categories ON items.id_category = categories.id) LEFT JOIN variants ON items.id_variant = variants.id) LEFT JOIN sizes ON items.id_size = sizes.id) LEFT JOIN images ON items.id_image = images.image)', (err, results, field) => {
        if (!err) {
          resolve(results)
        } else {
          rejected(err)
        }
      })
    })
    // }
  },
  getItemDetailJoin: (table, id) => {
    // if (key) {
    //   return new Promise((resolve, rejected) => {
    //     db.query()
    //   })
    // } else {
    // console.log(id[0])
    return new Promise((resolve, rejected) => {
      db.query('SELECT items.id, items.name, categories.name AS category, variants.name AS variant, sizes.size, items.description, items.price, images.image FROM ((((items LEFT JOIN categories ON items.id_category = categories.id) LEFT JOIN variants ON items.id_variant = variants.id) LEFT JOIN sizes ON items.id_size = sizes.id) LEFT JOIN images ON items.id_image = images.image) WHERE items.id = ?', [id[0]], (err, results, field) => {
        if (!err) {
          resolve(results)
        } else {
          rejected(err)
        }
      })
    })
    // }
  },
  detailItem: (table, id) => {
    return new Promise((resolve, rejected) => {
      console.log(id)
      db.query('SELECT * FROM ?? WHERE ?', [table, id], (err, results, field) => {
        if (!err) {
          resolve(results)
        } else {
          rejected(err)
        }
      })
    })
  },
  updatePatchItem: (table, data, id) => {
    return new Promise((resolve, rejected) => {
      db.query('UPDATE ?? SET ? WHERE ?', [table, data, id], (err, results, field) => {
        if (!err) {
          resolve(results)
        } else {
          rejected(err)
        }
      })
    })
  },
  deleteItem: (table, id) => {
    return new Promise((resolve, rejected) => {
      db.query('DELETE FROM ?? WHERE ?', [table, id], (err, results, field) => {
        if (!err) {
          resolve(results)
        } else {
          rejected(err)
        }
      })
    })
  },
  selectDataJoin: (data, from) => {
    return new Promise((resolve, rejected) => {
      db.query(`SELECT ${data} FROM ${from}`, (err, results, field) => {
        console.log('dataaaaa', results)
        if (!err) {
          resolve(results)
        } else {
          rejected(err)
        }
      })
    })
  }
}
