// @flow
import React from 'react'
import {
  compose,
  lifecycle,
  setDisplayName,
  withProps,
  withPropsOnChange,
  withStateHandlers,
} from '../../../../util/container'
import {Box, ClickableBox, List, Text} from '../../../../common-adapters/index'
import {globalColors, globalMargins, globalStyles, isMobile, collapseStyles} from '../../../../styles'

type Props<D: {channelName: string, selected: boolean}> = {
  rowRenderer: (i: number, d: D) => React$Element<*>,
  data: Array<D>,
  style: Object,
  selectedIndex: number,
}

type MentionDatum = {
  channelName: string,
  selected: boolean,
  onClick: () => void,
  onHover: () => void,
}

const MentionRowRenderer = ({channelName, selected, onClick, onHover}: MentionDatum) => (
  <ClickableBox
    style={{
      ...globalStyles.flexBoxRow,
      height: 40,
      alignItems: 'center',
      paddingLeft: globalMargins.tiny,
      paddingRight: globalMargins.tiny,
      backgroundColor: selected && !isMobile ? globalColors.blue4 : undefined,
    }}
    onClick={onClick}
    onMouseOver={onHover}
  >
    <Text type="BodySemibold" style={{marginLeft: globalMargins.tiny}}>
      #{channelName}
    </Text>
  </ClickableBox>
)

// We want to render Hud even if there's no data so we can still have lifecycle methods so we can still do things
// This is important if you type a filter that gives you no results and you press enter for instance
const Hud = ({style, data, rowRenderer, selectedIndex}: Props<*>) =>
  data.length ? (
    <Box style={collapseStyles([hudStyle, style])}>
      <List
        items={data}
        renderItem={rowRenderer}
        selectedIndex={selectedIndex}
        fixedHeight={40}
        keyboardShouldPersistTaps="always"
      />
    </Box>
  ) : null

const hudStyle = {
  ...globalStyles.flexBoxRow,
  backgroundColor: globalColors.white,
}

// TODO share this connector with user-mention-hud?
const MentionHud = compose(
  withStateHandlers(
    {selectedIndex: 0},
    {
      setSelectedIndex: () => (selectedIndex: number) => ({selectedIndex}),
    }
  ),
  withProps((props: {channels: Array<string>, filter: string, selectedIndex: number}) => ({
    data: props.channels
      ? props.channels
          .reduce((arr, c) => {
            c.toLowerCase().indexOf(props.filter) >= 0 && arr.push(c)
            return arr
          }, [])
          .sort()
          .map((c, i) => ({channelName: c, selected: i === props.selectedIndex}))
      : {},
  })),
  setDisplayName('ChannelMentionHud'),
  lifecycle({
    componentWillReceiveProps: function(nextProps) {
      if (nextProps.data.length === 0) {
        nextProps.setSelectedIndex(0)
      }
      if (nextProps.data.length && nextProps.data.length !== this.props.data.length) {
        nextProps.setSelectedIndex(Math.min(nextProps.selectedIndex, nextProps.data.length - 1))
      }

      if (nextProps.selectUpCounter !== this.props.selectUpCounter) {
        let next = nextProps.selectedIndex - 1
        if (next < 0) {
          next = Math.max(nextProps.data.length - 1, 0)
        }
        nextProps.setSelectedIndex(next)
      } else if (nextProps.selectDownCounter !== this.props.selectDownCounter) {
        let next = nextProps.selectedIndex + 1
        if (next >= nextProps.data.length) {
          next = 0
        }
        nextProps.setSelectedIndex(next)
      }

      if (nextProps.pickSelectedChannelCounter !== this.props.pickSelectedChannelCounter) {
        if (nextProps.selectedIndex < nextProps.data.length) {
          nextProps.onPickChannel(nextProps.data[nextProps.selectedIndex].channelName)
        } else {
          // Just exit
          nextProps.onPickChannel(nextProps.filter, {notChannel: true})
        }
      }

      if (nextProps.selectedIndex !== this.props.selectedIndex) {
        if (nextProps.selectedIndex < nextProps.data.length) {
          nextProps.onSelectChannel(nextProps.data[nextProps.selectedIndex].channelName)
        }
      }
    },
  }),
  withPropsOnChange(['onPickChannel'], ownerProps => ({
    rowRenderer: (index, props) => (
      <MentionRowRenderer
        key={props.channelName}
        onClick={() => ownerProps.onPickChannel(props.channelName)}
        onHover={() => ownerProps.setSelectedIndex(index)}
        {...props}
      />
    ),
  }))
)(Hud)

export {MentionRowRenderer, MentionHud}
export default Hud
