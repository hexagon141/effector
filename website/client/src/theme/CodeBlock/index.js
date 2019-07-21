// @flow

import * as React from 'react'
import {useEffect, useState, useRef} from 'react'


import classnames from 'classnames'
import Highlight, {defaultProps} from 'prism-react-renderer'
import nightOwlTheme from 'prism-react-renderer/themes/nightOwl'
import Clipboard from 'clipboard'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import styles from './styles.module.css'

export default ({
  children,
  className: languageClassName,
  repl,
}: {
  children: React.Node,
  className: string,
  repl: boolean,
}) => {
  const {
    siteConfig: {
      themeConfig: {prismTheme},
    },
  } = useDocusaurusContext()
  const [showCopied, setShowCopied] = useState(false)
  const target = useRef(null)
  const button = useRef(null)

  useEffect(() => {
    let clipboard

    if (button.current) {
      clipboard = new Clipboard(button.current, {
        target: () => target.current,
      })
    }

    return () => {
      if (clipboard) {
        clipboard.destroy()
      }
    }
  }, [button.current, target.current])

  const language =
    languageClassName && languageClassName.replace(/language-/, '')

  const handleCopyCode = () => {
    window.getSelection().empty()
    setShowCopied(true)

    setTimeout(() => setShowCopied(false), 2000)
  }

  return (
    <>
      HELLO
      <Highlight
        {...defaultProps}
        theme={prismTheme || nightOwlTheme}
        code={children.trim()}
        language={language}>
        {({className, style, tokens, getLineProps, getTokenProps}) => (
          <div className={styles.codeBlockWrapper}>
            <pre
              ref={target}
              className={classnames(className, styles.codeBlock)}
              style={style}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({line, key: i})}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({token, key})} />
                  ))}
                </div>
              ))}
            </pre>
            <button
              ref={button}
              type="button"
              aria-label="Copy code to clipboard"
              className={styles.copyButton}
              onClick={handleCopyCode}>
              {showCopied ? 'Copied' : 'Copy'}
            </button>
          </div>
        )}
      </Highlight>
    </>
  )
}
